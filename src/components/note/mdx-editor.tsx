import { forwardRef, useImperativeHandle, useRef, useCallback, useState, useEffect } from "react";
import {
    MDXEditor,
    type MDXEditorMethods,
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    linkPlugin,
    linkDialogPlugin,
    imagePlugin,
    tablePlugin,
    codeBlockPlugin,
    codeMirrorPlugin,
    diffSourcePlugin,
    toolbarPlugin,
    UndoRedo,
    BoldItalicUnderlineToggles,
    BlockTypeSelect,
    CreateLink,
    InsertImage,
    InsertTable,
    InsertThematicBreak,
    ListsToggle,
    CodeToggle,
    DiffSourceToggleWrapper,
    Separator,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import "./mdx-editor.css";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/components/context/theme-context";

type EditorViewMode = "rich-text" | "source" | "diff";

interface MarkdownEditorProps {
    value: string;
    onChange?: (value: string) => void;
    readOnly?: boolean;
    placeholder?: string;
}

export interface MarkdownEditorRef {
    getValue: () => string;
    setValue: (value: string) => void;
}

export const MarkdownEditor = forwardRef<MarkdownEditorRef, MarkdownEditorProps>(
    ({ value, onChange, readOnly = false, placeholder }, ref) => {
        const { t } = useTranslation();
        const { resolvedTheme } = useTheme();
        const editorRef = useRef<MDXEditorMethods>(null);
        const contentRef = useRef(value);
        const [editorKey, setEditorKey] = useState(0);

        useEffect(() => {
            contentRef.current = value;
        }, [value]);

        const handleChange = useCallback((markdown: string) => {
            contentRef.current = markdown;
            onChange?.(markdown);
        }, [onChange]);

        useImperativeHandle(ref, () => ({
            getValue: () => contentRef.current,
            setValue: (newValue: string) => {
                contentRef.current = newValue;
                if (editorRef.current) {
                    editorRef.current.setMarkdown(newValue);
                } else {
                    setEditorKey(k => k + 1);
                }
            },
        }), []);

        const toolbarContents = useCallback(() => (
            <DiffSourceToggleWrapper>
                <UndoRedo />
                <Separator />
                <BlockTypeSelect />
                <Separator />
                <BoldItalicUnderlineToggles />
                <CodeToggle />
                <Separator />
                <ListsToggle />
                <Separator />
                <CreateLink />
                <InsertImage />
                <InsertTable />
                <InsertThematicBreak />
            </DiffSourceToggleWrapper>
        ), []);

        const plugins = [
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            markdownShortcutPlugin(),
            linkPlugin(),
            linkDialogPlugin(),
            imagePlugin(),
            tablePlugin(),
            codeBlockPlugin({ defaultCodeBlockLanguage: "text" }),
            codeMirrorPlugin({
                codeBlockLanguages: {
                    js: "JavaScript",
                    javascript: "JavaScript",
                    ts: "TypeScript",
                    typescript: "TypeScript",
                    jsx: "JSX",
                    tsx: "TSX",
                    css: "CSS",
                    html: "HTML",
                    json: "JSON",
                    python: "Python",
                    py: "Python",
                    go: "Go",
                    rust: "Rust",
                    java: "Java",
                    c: "C",
                    cpp: "C++",
                    csharp: "C#",
                    sql: "SQL",
                    bash: "Bash",
                    shell: "Shell",
                    yaml: "YAML",
                    xml: "XML",
                    markdown: "Markdown",
                    md: "Markdown",
                    text: "Plain Text",
                    "": "Plain Text",
                },
            }),
            diffSourcePlugin({ viewMode: "rich-text" as EditorViewMode }),
            ...(readOnly ? [] : [toolbarPlugin({ toolbarContents })]),
        ];

        return (
            <div 
                className={`mdx-editor-container h-full ${resolvedTheme === "dark" ? "dark-theme" : ""}`}
                data-color-mode={resolvedTheme}
            >
                <MDXEditor
                    key={editorKey}
                    ref={editorRef}
                    markdown={value}
                    onChange={handleChange}
                    readOnly={readOnly}
                    placeholder={placeholder || t("noteContentPlaceholder") || "请输入内容..."}
                    plugins={plugins}
                    contentEditableClassName="prose prose-sm max-w-none dark:prose-invert min-h-[300px]"
                />
            </div>
        );
    }
);

MarkdownEditor.displayName = "MarkdownEditor";
