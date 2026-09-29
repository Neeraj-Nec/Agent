import { useEffect, useMemo, useRef, useState } from "react";
import { deleteDocument, getApiBaseUrl, listDocuments, uploadDocument } from "../../services/api/client";
import type { WorkspaceDocument } from "../../types/api";
import { Icon } from "../../components/ui/Icon";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

interface DocumentsPageProps { onDocumentsChanged: () => void; }

export function DocumentsPage({ onDocumentsChanged }: DocumentsPageProps) {
  const [documents, setDocuments] = useState<WorkspaceDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      setDocuments(await listDocuments());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not load your documents.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void refresh(); }, []);

  async function addFiles(files: FileList | File[]) {
    if (!files.length) return;
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files)) await uploadDocument(file);
      await refresh();
      onDocumentsChanged();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The file could not be uploaded.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function removeDocument(document: WorkspaceDocument) {
    if (!window.confirm("Delete " + document.file_name + " from this workspace?")) return;
    try {
      await deleteDocument(document.id);
      setDocuments((current) => current.filter((item) => item.id !== document.id));
      onDocumentsChanged();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The document could not be deleted.");
    }
  }

  const filtered = useMemo(
    () => documents.filter((item) => item.file_name.toLowerCase().includes(query.toLowerCase())),
    [documents, query],
  );
  const totalSize = documents.reduce((total, item) => total + item.size_bytes, 0);

  return (
    <section className="section-page">
      <div className="page-heading-row">
        <div><div className="eyebrow">KNOWLEDGE BASE</div><h1>Source library</h1><p className="page-description">Bring your research material together. Your files become available to connected agents.</p></div>
        <button className="primary-button" onClick={() => inputRef.current?.click()} disabled={uploading}><Icon name="upload" size={16} />{uploading ? "Uploading?" : "Add documents"}</button>
      </div>
      <input ref={inputRef} className="visually-hidden" type="file" multiple accept=".pdf,.doc,.docx,.txt,.md" onChange={(event) => event.target.files && void addFiles(event.target.files)} />

      <div className={"upload-dropzone " + (dragging ? "dropzone-active" : "")}
        onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => { event.preventDefault(); setDragging(false); void addFiles(event.dataTransfer.files); }}>
        <div className="dropzone-icon"><Icon name="upload" size={20} /></div>
        <div className="dropzone-copy"><strong>{uploading ? "Uploading your files?" : "Drop research files here"}</strong><span>or <button onClick={() => inputRef.current?.click()}>browse your computer</button></span></div>
        <span className="dropzone-limits">PDF, DOCX, TXT, MD <i /> Up to 25 MB each</span>
      </div>

      {error && <div className="page-alert"><Icon name="alert" size={17} /><span>{error}</span><button onClick={() => void refresh()}>Retry</button></div>}

      <div className="library-summary">
        <div className="summary-metric"><span className="summary-icon summary-icon-violet"><Icon name="library" size={17} /></span><div><strong>{documents.length}</strong><span>Documents</span></div></div>
        <div className="summary-metric"><span className="summary-icon summary-icon-green"><Icon name="database" size={17} /></span><div><strong>{formatBytes(totalSize)}</strong><span>Storage used</span></div></div>
        <div className="summary-hint"><span className="summary-hint-dot" />Local development storage <span className="summary-hint-separator">?</span> backed by your workspace</div>
      </div>

      <div className="table-toolbar">
        <div><h2>Your documents</h2><span>{loading ? "Loading?" : documents.length + " files"}</span></div>
        <div className="table-actions">
          <label className="search-field"><Icon name="search" size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search documents" /></label>
          <button className="square-button" aria-label="Refresh documents" onClick={() => void refresh()}><Icon name="refresh" size={16} /></button>
        </div>
      </div>

      <div className="document-table">
        <div className="document-table-header"><span>NAME</span><span>TYPE</span><span>SIZE</span><span>ADDED</span><span /></div>
        {loading ? <div className="table-empty"><span className="loading-spinner" />Loading your library</div> :
          filtered.length === 0 ? (
            <div className="table-empty">
              <span className="table-empty-icon"><Icon name={query ? "search" : "library"} size={19} /></span>
              <strong>{query ? "No matching documents" : error ? "Library unavailable" : "Your source library is empty"}</strong>
              <span>{query ? "Try a different search." : error ? "Start PostgreSQL and initialize the database, then retry." : "Upload a paper, report, or note to start building your research base."}</span>
              {!query && !error && <button className="text-link" onClick={() => inputRef.current?.click()}>Upload your first document</button>}
            </div>
          ) : filtered.map((document) => (
            <div className="document-table-row" key={document.id}>
              <div className="document-name-cell"><span className="document-file-icon"><Icon name="file" size={17} /></span><div><strong>{document.file_name}</strong><small>Added {formatDate(document.created_at)}</small></div></div>
              <span className="document-type-text">{document.media_type.split("/").pop()?.toUpperCase() || "FILE"}</span>
              <span className="document-size">{formatBytes(document.size_bytes)}</span>
              <span className="document-date">{formatDate(document.created_at)}</span>
              <div className="document-row-actions">
                <a className="square-button" href={getApiBaseUrl() + "/documents/" + document.id + "/content"} aria-label={"Download " + document.file_name} title="Download"><Icon name="external" size={15} /></a>
                <button className="square-button danger-hover" onClick={() => void removeDocument(document)} aria-label={"Delete " + document.file_name} title="Delete"><Icon name="trash" size={15} /></button>
              </div>
            </div>
          ))}
      </div>
      <p className="library-footnote"><Icon name="shield" size={14} />Files are stored locally in development. Document parsing and RAG indexing are not connected yet.</p>
    </section>
  );
}
