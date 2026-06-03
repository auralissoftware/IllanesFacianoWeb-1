import { FormEvent, useCallback, useEffect, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { adminLogout } from "../../lib/adminAuth";
import {
  fetchAdminCatalogItemForEdit,
  fetchAdminCatalogItems,
  type CatalogListing,
} from "../../lib/catalogRepository";
import {
  deleteCatalogItem,
  publishCatalogItem,
  updateCatalogItem,
} from "../../lib/publishCatalogItem";
import {
  adminCategorias,
  adminEstadosVehiculo,
  adminMonedas,
  adminOperacionesPropiedad,
  adminTiposBienMueble,
  adminTiposPropiedad,
  adminTiposSubasta,
  getBienMuebleFieldLabel,
  getBienMuebleFields,
  getPrecioLabel,
  initialCommonFields,
  initialPropiedadFields,
  initialRemateFields,
  initialVehiculoFields,
  validateBienMuebleFields,
  type AdminCategoria,
  type AdminCommonFields,
  type AdminImageFile,
  type AdminPropiedadFields,
  type AdminRemateFields,
  type AdminVehiculoFields,
} from "../../types/adminCatalog";
import { AdminPublicationList } from "./AdminPublicationList";
import { ImageDropzone } from "./ImageDropzone";

type FieldErrors = Record<string, string>;
type DashboardView = "list" | "form";
type FormMode = "create" | "edit";
type FilterTab = AdminCategoria | "all";

function validateForm(
  categoria: AdminCategoria,
  common: AdminCommonFields,
  propiedad: AdminPropiedadFields,
  vehiculo: AdminVehiculoFields,
  remate: AdminRemateFields,
): FieldErrors {
  const errors: FieldErrors = {};

  if (!common.titulo.trim()) errors.titulo = "El título es obligatorio.";
  if (!common.descripcion.trim()) errors.descripcion = "La descripción es obligatoria.";
  if (!common.ubicacion.trim()) errors.ubicacion = "La ubicación es obligatoria.";
  if (!common.precio.trim()) errors.precio = "El precio o base es obligatorio.";

  if (categoria === "propiedades") {
    if (!propiedad.tipoPropiedad) errors.tipoPropiedad = "Elegí el tipo de propiedad.";
    if (!propiedad.operacion) errors.operacion = "Elegí la operación.";
    if (!propiedad.superficie.trim()) errors.superficie = "Indicá la superficie.";
    if (!propiedad.ambientes.trim()) errors.ambientes = "Indicá los ambientes.";
    if (!propiedad.dormitorios.trim()) errors.dormitorios = "Indicá los dormitorios.";
    if (!propiedad.banos.trim()) errors.banos = "Indicá los baños.";
  }

  if (categoria === "bienes_muebles") {
    if (!vehiculo.tipoBien) {
      errors.tipoBien = "Elegí el tipo de bien.";
    }

    Object.entries(validateBienMuebleFields(vehiculo)).forEach(([key, message]) => {
      errors[key] = message;
    });
  }

  if (categoria === "remates") {
    if (!remate.tipoSubasta) errors.tipoSubasta = "Elegí el tipo de subasta.";
    if (!remate.fecha.trim()) errors.fecha = "Indicá la fecha del remate.";
    if (!remate.hora.trim()) errors.hora = "Indicá la hora del remate.";
    if (!remate.martillero.trim()) errors.martillero = "Indicá el martillero a cargo.";
  }

  return errors;
}

type AdminFieldProps = {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
};

function AdminField({ id, label, error, children, className = "" }: AdminFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="admin-field-label">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="admin-field-error">
          {error}
        </p>
      )}
    </div>
  );
}

function revokeBlobUrls(images: AdminImageFile[]) {
  images.forEach((image) => {
    if (image.file) {
      URL.revokeObjectURL(image.previewUrl);
    }
  });
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [view, setView] = useState<DashboardView>("list");
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [items, setItems] = useState<CatalogListing[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [listError, setListError] = useState("");
  const [listSuccess, setListSuccess] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  const [categoria, setCategoria] = useState<AdminCategoria>("propiedades");
  const [common, setCommon] = useState(initialCommonFields);
  const [propiedad, setPropiedad] = useState(initialPropiedadFields);
  const [vehiculo, setVehiculo] = useState(initialVehiculoFields);
  const [remate, setRemate] = useState(initialRemateFields);
  const [images, setImages] = useState<AdminImageFile[]>([]);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [formSuccess, setFormSuccess] = useState("");
  const [submitError, setSubmitError] = useState("");

  const loadItems = useCallback(async () => {
    setIsLoadingList(true);
    setListError("");

    try {
      const listings = await fetchAdminCatalogItems();
      setItems(listings);
    } catch (error) {
      setItems([]);
      setListError(
        error instanceof Error
          ? error.message
          : "No pudimos cargar las publicaciones.",
      );
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  function resetFormState() {
    revokeBlobUrls(images);
    setCategoria("propiedades");
    setCommon(initialCommonFields);
    setPropiedad(initialPropiedadFields);
    setVehiculo(initialVehiculoFields);
    setRemate(initialRemateFields);
    setImages([]);
    setFieldErrors({});
    setFormSuccess("");
    setSubmitError("");
  }

  function openCreateForm() {
    resetFormState();
    setFormMode("create");
    setEditingId(null);
    setView("form");
  }

  async function openEditForm(id: string) {
    setIsLoadingForm(true);
    setSubmitError("");
    setFormSuccess("");

    try {
      const item = await fetchAdminCatalogItemForEdit(id);

      if (!item) {
        setListError("No encontramos esa publicación.");
        return;
      }

      revokeBlobUrls(images);
      setCategoria(item.categoria);
      setCommon(item.common);
      setPropiedad(item.propiedad);
      setVehiculo(item.vehiculo);
      setRemate(item.remate);
      setImages(item.media);
      setFieldErrors({});
      setFormMode("edit");
      setEditingId(id);
      setView("form");
    } catch (error) {
      setListError(
        error instanceof Error
          ? error.message
          : "No pudimos cargar la publicación para editar.",
      );
    } finally {
      setIsLoadingForm(false);
    }
  }

  function backToList(message?: string) {
    resetFormState();
    setView("list");
    setFormMode("create");
    setEditingId(null);

    if (message) {
      setListSuccess(message);
    }

    loadItems();
  }

  async function handleDelete(id: string) {
    const item = items.find((entry) => entry.id === id);
    const title = item?.title ?? "esta publicación";

    if (
      !window.confirm(
        `¿Eliminar "${title}"?\n\nEsta acción no se puede deshacer.`,
      )
    ) {
      return;
    }

    setDeletingId(id);
    setListError("");
    setListSuccess("");

    const result = await deleteCatalogItem(id);
    setDeletingId(null);

    if (!result.ok) {
      setListError(result.error);
      return;
    }

    setItems((current) => current.filter((entry) => entry.id !== id));
    setListSuccess("Publicación eliminada correctamente.");
  }

  function updateCommon<K extends keyof AdminCommonFields>(
    key: K,
    value: AdminCommonFields[K],
  ) {
    setCommon((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
    setFormSuccess("");
    setSubmitError("");
  }

  function switchCategoria(next: AdminCategoria) {
    setCategoria(next);
    setFieldErrors({});
    setFormSuccess("");
    setSubmitError("");
  }

  function inputClass(fieldName: string) {
    return `admin-field-input ${fieldErrors[fieldName] ? "admin-field-input-error" : ""}`;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors = validateForm(categoria, common, propiedad, vehiculo, remate);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setSubmitError("Revisá los campos marcados antes de guardar.");
      return;
    }

    setIsSaving(true);
    setSubmitError("");
    setFormSuccess("");

    const newFiles = images
      .filter((image): image is AdminImageFile & { file: File } => Boolean(image.file))
      .map((image) => image.file);

    const payload = {
      categoria,
      common,
      propiedad: categoria === "propiedades" ? propiedad : undefined,
      vehiculo: categoria === "bienes_muebles" ? vehiculo : undefined,
      remate: categoria === "remates" ? remate : undefined,
      images: newFiles,
    };

    const result =
      formMode === "edit" && editingId
        ? await updateCatalogItem({
            ...payload,
            itemId: editingId,
            keptMediaIds: images.filter((image) => !image.file).map((image) => image.id),
          })
        : await publishCatalogItem(payload);

    setIsSaving(false);

    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }

    backToList(
      formMode === "edit"
        ? "Publicación actualizada correctamente."
        : "Activo publicado correctamente.",
    );
  }

  return (
    <div className="admin-dashboard-shell min-h-screen">
      <header className="admin-dashboard-header">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="admin-dashboard-header-icon">
              <LayoutDashboard className="size-5 text-azul-francia" strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">
                Illanes Faciano
              </p>
              <h1 className="text-lg font-semibold text-slate-deep sm:text-xl">
                Panel de administración
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/" className="admin-dashboard-link">
              Ver sitio público
            </Link>
            <button
              type="button"
              className="admin-dashboard-logout"
              onClick={async () => {
                await adminLogout();
                navigate("/admin/login", { replace: true });
              }}
            >
              <LogOut className="size-4" strokeWidth={2} />
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <div className="admin-dashboard-card">
          {view === "list" ? (
            <>
              {listSuccess && (
                <div className="admin-dashboard-success mb-6" role="status">
                  <CheckCircle2 className="size-5 shrink-0" strokeWidth={2} />
                  {listSuccess}
                </div>
              )}

              <AdminPublicationList
                items={items}
                isLoading={isLoadingList}
                error={listError}
                filterTab={filterTab}
                deletingId={deletingId}
                onFilterChange={setFilterTab}
                onAdd={openCreateForm}
                onEdit={openEditForm}
                onDelete={handleDelete}
              />
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => backToList()}
                className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-azul-francia transition hover:text-navy"
              >
                <ArrowLeft className="size-4" strokeWidth={2} />
                Volver al catálogo
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-deep">
                  {formMode === "edit" ? "Modificar publicación" : "Agregar publicación"}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {formMode === "edit"
                    ? "Actualizá los datos y guardá los cambios. Los clientes verán la versión nueva al instante."
                    : "Elegí la categoría y completá los datos. El formulario se adapta según lo que vayas a publicar."}
                </p>
              </div>

              {isLoadingForm ? (
                <p className="text-sm font-medium text-muted">Cargando publicación...</p>
              ) : (
                <>
                  <div
                    className="admin-category-tabs"
                    role="tablist"
                    aria-label="Categoría de publicación"
                  >
                    {adminCategorias.map(({ id, label }) => {
                      const isActive = categoria === id;

                      return (
                        <button
                          key={id}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          onClick={() => switchCategoria(id)}
                          disabled={isSaving || formMode === "edit"}
                          className={`admin-category-tab ${
                            isActive
                              ? "admin-category-tab-active"
                              : "admin-category-tab-inactive"
                          } ${formMode === "edit" ? "cursor-not-allowed opacity-70" : ""}`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  {formMode === "edit" && (
                    <p className="mt-3 text-xs text-muted">
                      La categoría no se puede cambiar al editar. Si necesitás mover el
                      activo a otra sección, eliminá esta publicación y creá una nueva.
                    </p>
                  )}

                  <form className="mt-8 space-y-8" onSubmit={handleSubmit} noValidate>
                    <section className="space-y-5">
                      <h3 className="admin-section-title">Información general</h3>

                      <AdminField id="titulo" label="Título *" error={fieldErrors.titulo}>
                        <input
                          id="titulo"
                          type="text"
                          value={common.titulo}
                          onChange={(e) => updateCommon("titulo", e.target.value)}
                          className={inputClass("titulo")}
                          disabled={isSaving}
                        />
                      </AdminField>

                      <AdminField
                        id="descripcion"
                        label="Descripción detallada *"
                        error={fieldErrors.descripcion}
                      >
                        <textarea
                          id="descripcion"
                          rows={5}
                          value={common.descripcion}
                          onChange={(e) => updateCommon("descripcion", e.target.value)}
                          className={`${inputClass("descripcion")} resize-none`}
                          disabled={isSaving}
                        />
                      </AdminField>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <AdminField
                          id="ubicacion"
                          label="Ubicación *"
                          error={fieldErrors.ubicacion}
                        >
                          <input
                            id="ubicacion"
                            type="text"
                            value={common.ubicacion}
                            onChange={(e) => updateCommon("ubicacion", e.target.value)}
                            className={inputClass("ubicacion")}
                            disabled={isSaving}
                          />
                        </AdminField>

                        <AdminField
                          id="precio"
                          label={getPrecioLabel(categoria)}
                          error={fieldErrors.precio}
                        >
                          <div className="space-y-2">
                            <div
                              className="admin-currency-toggle"
                              role="group"
                              aria-label="Moneda del precio"
                            >
                              {adminMonedas.map(({ value, label }) => (
                                <button
                                  key={value}
                                  type="button"
                                  className={
                                    common.moneda === value
                                      ? "admin-currency-toggle-btn admin-currency-toggle-btn-active"
                                      : "admin-currency-toggle-btn"
                                  }
                                  onClick={() => updateCommon("moneda", value)}
                                  disabled={isSaving}
                                  aria-pressed={common.moneda === value}
                                >
                                  {value === "usd" ? "US$" : "$"} {label}
                                </button>
                              ))}
                            </div>
                            <input
                              id="precio"
                              type="text"
                              value={common.precio}
                              onChange={(e) => updateCommon("precio", e.target.value)}
                              className={inputClass("precio")}
                              disabled={isSaving}
                            />
                          </div>
                        </AdminField>
                      </div>
                    </section>

                    {categoria === "propiedades" && (
                      <section className="space-y-5">
                        <h3 className="admin-section-title">Datos de la propiedad</h3>

                        <div className="grid gap-5 sm:grid-cols-2">
                          <AdminField
                            id="tipoPropiedad"
                            label="Tipo de propiedad *"
                            error={fieldErrors.tipoPropiedad}
                          >
                            <select
                              id="tipoPropiedad"
                              value={propiedad.tipoPropiedad}
                              onChange={(e) =>
                                setPropiedad((current) => ({
                                  ...current,
                                  tipoPropiedad: e.target.value,
                                }))
                              }
                              className={inputClass("tipoPropiedad")}
                              disabled={isSaving}
                            >
                              {adminTiposPropiedad.map(({ value, label }) => (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              ))}
                            </select>
                          </AdminField>

                          <AdminField
                            id="operacion"
                            label="Operación *"
                            error={fieldErrors.operacion}
                          >
                            <select
                              id="operacion"
                              value={propiedad.operacion}
                              onChange={(e) =>
                                setPropiedad((current) => ({
                                  ...current,
                                  operacion: e.target.value,
                                }))
                              }
                              className={inputClass("operacion")}
                              disabled={isSaving}
                            >
                              {adminOperacionesPropiedad.map(({ value, label }) => (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              ))}
                            </select>
                          </AdminField>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                          <AdminField
                            id="superficie"
                            label="Superficie (m²) *"
                            error={fieldErrors.superficie}
                          >
                            <input
                              id="superficie"
                              type="number"
                              min="0"
                              value={propiedad.superficie}
                              onChange={(e) =>
                                setPropiedad((current) => ({
                                  ...current,
                                  superficie: e.target.value,
                                }))
                              }
                              className={inputClass("superficie")}
                              disabled={isSaving}
                            />
                          </AdminField>

                          <AdminField
                            id="ambientes"
                            label="Ambientes *"
                            error={fieldErrors.ambientes}
                          >
                            <input
                              id="ambientes"
                              type="number"
                              min="0"
                              value={propiedad.ambientes}
                              onChange={(e) =>
                                setPropiedad((current) => ({
                                  ...current,
                                  ambientes: e.target.value,
                                }))
                              }
                              className={inputClass("ambientes")}
                              disabled={isSaving}
                            />
                          </AdminField>

                          <AdminField
                            id="dormitorios"
                            label="Dormitorios *"
                            error={fieldErrors.dormitorios}
                          >
                            <input
                              id="dormitorios"
                              type="number"
                              min="0"
                              value={propiedad.dormitorios}
                              onChange={(e) =>
                                setPropiedad((current) => ({
                                  ...current,
                                  dormitorios: e.target.value,
                                }))
                              }
                              className={inputClass("dormitorios")}
                              disabled={isSaving}
                            />
                          </AdminField>

                          <AdminField id="banos" label="Baños *" error={fieldErrors.banos}>
                            <input
                              id="banos"
                              type="number"
                              min="0"
                              value={propiedad.banos}
                              onChange={(e) =>
                                setPropiedad((current) => ({
                                  ...current,
                                  banos: e.target.value,
                                }))
                              }
                              className={inputClass("banos")}
                              disabled={isSaving}
                            />
                          </AdminField>
                        </div>
                      </section>
                    )}

                    {categoria === "bienes_muebles" && (() => {
                      const fields = getBienMuebleFields(vehiculo.tipoBien);
                      const marcaField = fields.find((field) => field.id === "marcaModelo");
                      const anioField = fields.find((field) => field.id === "anio");
                      const kmField = fields.find((field) => field.id === "kilometraje");
                      const estadoField = fields.find((field) => field.id === "estado");

                      function handleTipoBienChange(nextTipo: string) {
                        const visibleIds = new Set(
                          getBienMuebleFields(nextTipo).map((field) => field.id),
                        );

                        setVehiculo((current) => ({
                          ...current,
                          tipoBien: nextTipo,
                          marcaModelo: visibleIds.has("marcaModelo") ? current.marcaModelo : "",
                          anio: visibleIds.has("anio") ? current.anio : "",
                          kilometraje: visibleIds.has("kilometraje")
                            ? current.kilometraje
                            : "",
                        }));

                        setFieldErrors((current) => {
                          const next = { ...current };
                          delete next.marcaModelo;
                          delete next.anio;
                          delete next.kilometraje;
                          delete next.estado;
                          delete next.tipoBien;
                          return next;
                        });
                        setFormSuccess("");
                        setSubmitError("");
                      }

                      return (
                        <section className="space-y-5">
                          <h3 className="admin-section-title">Datos del vehículo o activo</h3>

                          <AdminField
                            id="tipoBien"
                            label="Tipo de bien *"
                            error={fieldErrors.tipoBien}
                          >
                            <select
                              id="tipoBien"
                              value={vehiculo.tipoBien}
                              onChange={(e) => handleTipoBienChange(e.target.value)}
                              className={inputClass("tipoBien")}
                              disabled={isSaving}
                            >
                              {adminTiposBienMueble.map(({ value, label }) => (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              ))}
                            </select>
                          </AdminField>

                          {marcaField && (
                            <AdminField
                              id="marcaModelo"
                              label={getBienMuebleFieldLabel(marcaField)}
                              error={fieldErrors.marcaModelo}
                            >
                              <input
                                id="marcaModelo"
                                type="text"
                                value={vehiculo.marcaModelo}
                                onChange={(e) =>
                                  setVehiculo((current) => ({
                                    ...current,
                                    marcaModelo: e.target.value,
                                  }))
                                }
                                className={inputClass("marcaModelo")}
                                disabled={isSaving}
                              />
                            </AdminField>
                          )}

                          {(anioField || kmField) && (
                            <div
                              className={`grid gap-5 ${
                                anioField && kmField ? "sm:grid-cols-2" : "grid-cols-1"
                              }`}
                            >
                              {anioField && (
                                <AdminField
                                  id="anio"
                                  label={getBienMuebleFieldLabel(anioField)}
                                  error={fieldErrors.anio}
                                >
                                  <input
                                    id="anio"
                                    type="number"
                                    min="1900"
                                    max="2100"
                                    value={vehiculo.anio}
                                    onChange={(e) =>
                                      setVehiculo((current) => ({
                                        ...current,
                                        anio: e.target.value,
                                      }))
                                    }
                                    className={inputClass("anio")}
                                    disabled={isSaving}
                                  />
                                </AdminField>
                              )}

                              {kmField && (
                                <AdminField
                                  id="kilometraje"
                                  label={getBienMuebleFieldLabel(kmField)}
                                  error={fieldErrors.kilometraje}
                                >
                                  <input
                                    id="kilometraje"
                                    type="text"
                                    value={vehiculo.kilometraje}
                                    onChange={(e) =>
                                      setVehiculo((current) => ({
                                        ...current,
                                        kilometraje: e.target.value,
                                      }))
                                    }
                                    className={inputClass("kilometraje")}
                                    disabled={isSaving}
                                  />
                                </AdminField>
                              )}
                            </div>
                          )}

                          {estadoField && (
                            <AdminField
                              id="estado"
                              label={getBienMuebleFieldLabel(estadoField)}
                              error={fieldErrors.estado}
                            >
                              <select
                                id="estado"
                                value={vehiculo.estado}
                                onChange={(e) =>
                                  setVehiculo((current) => ({
                                    ...current,
                                    estado: e.target.value as AdminVehiculoFields["estado"],
                                  }))
                                }
                                className={inputClass("estado")}
                                disabled={isSaving}
                              >
                                {adminEstadosVehiculo.map(({ value, label }) => (
                                  <option key={value} value={value}>
                                    {label}
                                  </option>
                                ))}
                              </select>
                            </AdminField>
                          )}
                        </section>
                      );
                    })()}

                    {categoria === "remates" && (
                      <section className="space-y-5">
                        <h3 className="admin-section-title">Datos del remate</h3>

                        <AdminField
                          id="tipoSubasta"
                          label="Tipo de subasta *"
                          error={fieldErrors.tipoSubasta}
                        >
                          <select
                            id="tipoSubasta"
                            value={remate.tipoSubasta}
                            onChange={(e) =>
                              setRemate((current) => ({
                                ...current,
                                tipoSubasta: e.target.value,
                              }))
                            }
                            className={inputClass("tipoSubasta")}
                            disabled={isSaving}
                          >
                            {adminTiposSubasta.map(({ value, label }) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </AdminField>

                        <div className="grid gap-5 sm:grid-cols-2">
                          <AdminField id="fecha" label="Fecha del remate *" error={fieldErrors.fecha}>
                            <input
                              id="fecha"
                              type="date"
                              value={remate.fecha}
                              onChange={(e) =>
                                setRemate((current) => ({ ...current, fecha: e.target.value }))
                              }
                              className={inputClass("fecha")}
                              disabled={isSaving}
                            />
                          </AdminField>

                          <AdminField id="hora" label="Hora del remate *" error={fieldErrors.hora}>
                            <input
                              id="hora"
                              type="time"
                              value={remate.hora}
                              onChange={(e) =>
                                setRemate((current) => ({ ...current, hora: e.target.value }))
                              }
                              className={inputClass("hora")}
                              disabled={isSaving}
                            />
                          </AdminField>
                        </div>

                        <AdminField
                          id="martillero"
                          label="Martillero a cargo *"
                          error={fieldErrors.martillero}
                        >
                          <input
                            id="martillero"
                            type="text"
                            value={remate.martillero}
                            onChange={(e) =>
                              setRemate((current) => ({ ...current, martillero: e.target.value }))
                            }
                            className={inputClass("martillero")}
                            disabled={isSaving}
                          />
                        </AdminField>
                      </section>
                    )}

                    <section className="space-y-4">
                      <h3 className="admin-section-title">Fotos y videos del activo</h3>
                      <ImageDropzone
                        images={images}
                        onChange={setImages}
                        disabled={isSaving}
                      />
                    </section>

                    {submitError && (
                      <div className="admin-dashboard-alert" role="alert">
                        {submitError}
                      </div>
                    )}

                    {formSuccess && (
                      <div className="admin-dashboard-success" role="status">
                        <CheckCircle2 className="size-5 shrink-0" strokeWidth={2} />
                        {formSuccess}
                      </div>
                    )}

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="btn-primary w-full sm:w-auto sm:min-w-52"
                      >
                        {isSaving
                          ? "Guardando..."
                          : formMode === "edit"
                            ? "Guardar cambios"
                            : "Publicar activo"}
                      </button>

                      <button
                        type="button"
                        onClick={() => backToList()}
                        disabled={isSaving}
                        className="admin-dashboard-logout w-full justify-center sm:w-auto"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
