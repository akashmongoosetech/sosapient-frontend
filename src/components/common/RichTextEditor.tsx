import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FieldLabel } from '../admin/ui';

// Toolbar mirrors the CaseStudy/Blog configuration, extended with the
// formatting controls the classic build supports. Items unavailable in the
// installed build are skipped by CKEditor with a console warning only.
const RICH_TOOLBAR = [
  'undo', 'redo', '|',
  'heading', '|',
  'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', 'highlight', '|',
  'bold', 'italic', 'underline', 'strikethrough', 'link', '|',
  'alignment', 'bulletedList', 'numberedList', 'outdent', 'indent', '|',
  'blockQuote', 'insertTable', 'horizontalLine', 'removeFormat',
];

/** True when HTML has no visible text (e.g. `<p></p>` or `<p><br></p>`). */
export function isRichTextEmpty(html: string): boolean {
  if (!html) return true;
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length === 0;
}

interface RichTextEditorProps {
  id?: string;
  label: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  error?: string | null;
  required?: boolean;
  disabled?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
}) => (
  <div className="job-rich-editor">
    <style>{`.job-rich-editor .ck-editor__editable_inline { min-height: 180px; max-height: 520px; }
.job-rich-editor .ck.ck-toolbar { flex-wrap: wrap; }
.job-rich-editor .ck.ck-content ul, .job-rich-editor .ck.ck-content ol { padding-left: 1.75em; }
.job-rich-editor .ck.ck-content ul { list-style-type: disc; }
.job-rich-editor .ck.ck-content ol { list-style-type: decimal; }
.job-rich-editor .ck.ck-content table { width: 100%; border-collapse: collapse; }
.job-rich-editor .ck.ck-content th, .job-rich-editor .ck.ck-content td { border: 1px solid #cbd5e1; padding: 0.5rem 0.75rem; }
.job-rich-editor .ck.ck-content blockquote { border-left: 4px solid #7F5FA8; padding-left: 1rem; font-style: italic; }
.job-rich-editor .ck.ck-content a { color: #6d4d94; }`}</style>
    <FieldLabel htmlFor={id}>
      {label}
      {required && <span aria-hidden="true"> *</span>}
    </FieldLabel>
    <CKEditor
      editor={ClassicEditor as unknown as any}
      data={value}
      disabled={disabled}
      config={{
        toolbar: RICH_TOOLBAR,
        placeholder: placeholder || `Write ${label.toLowerCase()}…`,
      }}
      onChange={(_event: unknown, editor: { getData: () => string }) => {
        onChange(editor.getData());
      }}
    />
    {error ? (
      <p role="alert" className="mt-1 text-xs text-red-600">
        {error}
      </p>
    ) : null}
  </div>
);

export default RichTextEditor;
