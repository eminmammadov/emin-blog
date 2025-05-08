import type React from 'react';
import { useEffect, useState, useRef } from 'react';
import styles from './MarkdownEditor.module.css';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = 'Contentinizi Markdown formatında bura yazın...',
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Client-side only
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync local value with external value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  if (!isMounted) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.toolbar}>
        <button
          type="button"
          onClick={() => {
            if (!textareaRef.current) return;

            const textarea = textareaRef.current;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            const before = text.substring(0, start);
            const selection = text.substring(start, end);
            const after = text.substring(end);

            const newText = `${before}**${selection}**${after}`;
            setLocalValue(newText);
            onChange(newText);

            // Set cursor position after formatting
            setTimeout(() => {
              textarea.focus();
              textarea.setSelectionRange(start + 2, end + 2);
            }, 0);
          }}
          title="Kalın"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => {
            if (!textareaRef.current) return;

            const textarea = textareaRef.current;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            const before = text.substring(0, start);
            const selection = text.substring(start, end);
            const after = text.substring(end);

            const newText = `${before}*${selection}*${after}`;
            setLocalValue(newText);
            onChange(newText);

            setTimeout(() => {
              textarea.focus();
              textarea.setSelectionRange(start + 1, end + 1);
            }, 0);
          }}
          title="İtalik"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => {
            if (!textareaRef.current) return;

            const textarea = textareaRef.current;
            const start = textarea.selectionStart;
            const text = textarea.value;
            const before = text.substring(0, start);
            const after = text.substring(start);

            const newText = `${before}# ${after}`;
            setLocalValue(newText);
            onChange(newText);

            setTimeout(() => {
              textarea.focus();
              textarea.setSelectionRange(start + 2, start + 2);
            }, 0);
          }}
          title="Başlık 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => {
            if (!textareaRef.current) return;

            const textarea = textareaRef.current;
            const start = textarea.selectionStart;
            const text = textarea.value;
            const before = text.substring(0, start);
            const after = text.substring(start);

            const newText = `${before}## ${after}`;
            setLocalValue(newText);
            onChange(newText);

            setTimeout(() => {
              textarea.focus();
              textarea.setSelectionRange(start + 3, start + 3);
            }, 0);
          }}
          title="Başlık 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => {
            if (!textareaRef.current) return;

            const textarea = textareaRef.current;
            const start = textarea.selectionStart;
            const text = textarea.value;
            const before = text.substring(0, start);
            const after = text.substring(start);

            const newText = `${before}- ${after}`;
            setLocalValue(newText);
            onChange(newText);

            setTimeout(() => {
              textarea.focus();
              textarea.setSelectionRange(start + 2, start + 2);
            }, 0);
          }}
          title="Madde İşaretli Liste"
        >
          • Liste
        </button>
        <button
          type="button"
          onClick={() => {
            if (!textareaRef.current) return;

            const textarea = textareaRef.current;
            const start = textarea.selectionStart;
            const text = textarea.value;
            const before = text.substring(0, start);
            const after = text.substring(start);

            const newText = `${before}1. ${after}`;
            setLocalValue(newText);
            onChange(newText);

            setTimeout(() => {
              textarea.focus();
              textarea.setSelectionRange(start + 3, start + 3);
            }, 0);
          }}
          title="Numaralı Liste"
        >
          1. Liste
        </button>
        <button
          type="button"
          onClick={() => {
            if (!textareaRef.current) return;

            const textarea = textareaRef.current;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            const before = text.substring(0, start);
            const selection = text.substring(start, end);
            const after = text.substring(end);

            const newText = `${before}\`${selection}\`${after}`;
            setLocalValue(newText);
            onChange(newText);

            setTimeout(() => {
              textarea.focus();
              textarea.setSelectionRange(start + 1, end + 1);
            }, 0);
          }}
          title="Kod"
        >
          {'`Kod`'}
        </button>
        <button
          type="button"
          onClick={() => {
            if (!textareaRef.current) return;

            const textarea = textareaRef.current;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            const before = text.substring(0, start);
            const selection = text.substring(start, end);
            const after = text.substring(end);

            const newText = `${before}> ${selection}${after}`;
            setLocalValue(newText);
            onChange(newText);

            setTimeout(() => {
              textarea.focus();
              textarea.setSelectionRange(start + 2, end + 2);
            }, 0);
          }}
          title="Alıntı"
        >
          &quot;Alıntı&quot;
        </button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt('Link URL\'i girin:');
            if (!url) return;

            if (!textareaRef.current) return;

            const textarea = textareaRef.current;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            const before = text.substring(0, start);
            const selection = text.substring(start, end);
            const after = text.substring(end);

            const linkText = selection || 'link metni';
            const newText = `${before}[${linkText}](${url})${after}`;
            setLocalValue(newText);
            onChange(newText);

            // İmleci uygun konuma getir
            setTimeout(() => {
              textarea.focus();
              const newPosition = start + linkText.length + url.length + 4; // "[]()" uzunluğu + metin + URL
              textarea.setSelectionRange(newPosition, newPosition);
            }, 0);
          }}
          title="Link Ekle (Yeni Sekmede Açılır)"
        >
          🔗
        </button>
        <button
          type="button"
          onClick={() => {
            // Kullanıcıya özel yol veya kendi URL'sini girme seçeneği sun
            const useDefaultPath = window.confirm('Blog resmi için varsayılan yolu kullanmak istiyor musunuz? (/images/blogs/...)');

            let url = '';
            if (useDefaultPath) {
              const imageName = window.prompt('Resim adını girin (örn: monad-labs.webp):');
              if (!imageName) return;
              url = `/images/blogs/${imageName}`;
            } else {
              url = window.prompt('Resim URL\'i girin:') || '';
              if (!url) return;
            }

            if (!textareaRef.current) return;

            const textarea = textareaRef.current;
            const start = textarea.selectionStart;
            const text = textarea.value;
            const before = text.substring(0, start);
            const after = text.substring(start);

            // Resim eklerken kullanıcıya 16:9 oranında resim kullanması gerektiğini hatırlatalım
            const newText = `${before}![16:9 oranında resim](${url})${after}`;
            setLocalValue(newText);
            onChange(newText);

            // İmleci uygun konuma getir
            setTimeout(() => {
              textarea.focus();
              const newPosition = start + url.length + 21; // "![Resim açıklaması](" uzunluğu + URL + ")"
              textarea.setSelectionRange(newPosition, newPosition);
            }, 0);
          }}
          title="Resim Ekle"
        >
          🖼️
        </button>
        <button
          type="button"
          onClick={() => {
            if (!textareaRef.current) return;

            const textarea = textareaRef.current;
            const start = textarea.selectionStart;
            const text = textarea.value;
            const before = text.substring(0, start);
            const after = text.substring(start);

            // Yeni satırlar ekleyerek çizgiyi önceki ve sonraki içerikten ayırıyoruz
            const newText = `${before}\n\n---\n\n${after}`;
            setLocalValue(newText);
            onChange(newText);

            // İmleci uygun konuma getir
            setTimeout(() => {
              textarea.focus();
              const newPosition = start + 7; // "\n\n---\n\n" uzunluğu
              textarea.setSelectionRange(newPosition, newPosition);
            }, 0);
          }}
          title="Yatay Çizgi Ekle"
        >
          —
        </button>
      </div>
      <textarea
        ref={textareaRef}
        className={styles.markdownTextarea}
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        rows={15}
      />
    </div>
  );
};

export default MarkdownEditor;
