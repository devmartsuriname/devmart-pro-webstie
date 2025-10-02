import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { 
  Bold, Italic, List, ListOrdered, Heading1, Heading2, Heading3, Heading4,
  Link as LinkIcon, ImageIcon, Undo, Redo, Code
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ content, onChange, placeholder }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[200px] px-4 py-3',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const ToolbarButton = ({ onClick, active, children, title }: any) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        padding: '8px',
        background: active ? 'rgba(99, 102, 241, 0.2)' : 'rgba(51, 65, 85, 0.3)',
        border: `1px solid ${active ? 'rgba(99, 102, 241, 0.5)' : 'rgba(51, 65, 85, 0.5)'}`,
        borderRadius: '6px',
        color: active ? '#818cf8' : '#94a3b8',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'rgba(51, 65, 85, 0.5)';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'rgba(51, 65, 85, 0.3)';
        }
      }}
    >
      {children}
    </button>
  );

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.6)',
      border: '1px solid rgba(51, 65, 85, 0.5)',
      borderRadius: '10px',
      overflow: 'hidden',
    }}>
      {/* Toolbar */}
      <div style={{
        padding: '12px',
        borderBottom: '1px solid rgba(51, 65, 85, 0.5)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        background: 'rgba(30, 41, 59, 0.5)',
      }}>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 style={{ width: '16px', height: '16px' }} />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 style={{ width: '16px', height: '16px' }} />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading3 style={{ width: '16px', height: '16px' }} />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          active={editor.isActive('heading', { level: 4 })}
          title="Heading 4"
        >
          <Heading4 style={{ width: '16px', height: '16px' }} />
        </ToolbarButton>

        <div style={{ width: '1px', background: 'rgba(51, 65, 85, 0.5)', margin: '0 4px' }} />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold"
        >
          <Bold style={{ width: '16px', height: '16px' }} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic"
        >
          <Italic style={{ width: '16px', height: '16px' }} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
          title="Code"
        >
          <Code style={{ width: '16px', height: '16px' }} />
        </ToolbarButton>

        <div style={{ width: '1px', background: 'rgba(51, 65, 85, 0.5)', margin: '0 4px' }} />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List style={{ width: '16px', height: '16px' }} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Ordered List"
        >
          <ListOrdered style={{ width: '16px', height: '16px' }} />
        </ToolbarButton>

        <div style={{ width: '1px', background: 'rgba(51, 65, 85, 0.5)', margin: '0 4px' }} />

        <ToolbarButton
          onClick={addLink}
          active={editor.isActive('link')}
          title="Add Link"
        >
          <LinkIcon style={{ width: '16px', height: '16px' }} />
        </ToolbarButton>

        <ToolbarButton
          onClick={addImage}
          title="Add Image"
        >
          <ImageIcon style={{ width: '16px', height: '16px' }} />
        </ToolbarButton>

        <div style={{ width: '1px', background: 'rgba(51, 65, 85, 0.5)', margin: '0 4px' }} />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo style={{ width: '16px', height: '16px' }} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo style={{ width: '16px', height: '16px' }} />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
