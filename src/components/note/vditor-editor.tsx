import { forwardRef, useImperativeHandle, useRef, useEffect, useCallback, useState } from "react";
import Vditor from "vditor";
import "vditor/dist/index.css";
import "./vditor-editor.css";
import { useTheme } from "@/components/context/theme-context";
import { useTranslation } from "react-i18next";
import env from "@/env.ts";

interface VditorEditorProps {
    value: string;
    onChange?: (value: string) => void;
    readOnly?: boolean;
    placeholder?: string;
    vault?: string;
    fileLinks?: Record<string, string>;
    initialMode?: "sv" | "wysiwyg" | "ir" | "preview";
}

export interface VditorEditorRef {
    getValue: () => string;
    setValue: (value: string) => void;
    exportPDF: () => void;
    exportHTML: () => void;
}

// 将 Obsidian ![[]] 语法转换为标准 Markdown（仅用于预览）
function transformObsidianSyntax(
    content: string,
    vault: string,
    fileLinks: Record<string, string>,
    token: string
): string {
    if (!content) return content;

    return content.replace(/!\[\[([^\]]+)\]\]/g, (_, inner) => {
        const parts = inner.split('|');
        const rawPath = parts[0].split('#')[0].trim();
        const resolvedPath = fileLinks[rawPath] || rawPath;
        const options = parts.slice(1);

        const apiUrl = `${env.API_URL}/api/note/file?vault=${encodeURIComponent(vault)}&path=${encodeURIComponent(resolvedPath)}&token=${encodeURIComponent(token)}`;
        const lowerPath = resolvedPath.toLowerCase();
        const isImage = /\.(png|jpg|jpeg|gif|svg|webp|bmp)$/i.test(lowerPath);
        const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(lowerPath);
        const isAudio = /\.(mp3|wav|ogg|m4a|flac)$/i.test(lowerPath);

        if (isImage) {
            let width = "";
            if (options[0]) {
                const sizeMatch = options[0].match(/^(\d+)/);
                if (sizeMatch) width = ` width="${sizeMatch[1]}"`;
            }
            return `<img src="${apiUrl}" alt="${rawPath}"${width} />`;
        } else if (isVideo) {
            return `<video src="${apiUrl}" controls style="max-width:100%"></video>`;
        } else if (isAudio) {
            return `<audio src="${apiUrl}" controls></audio>`;
        } else {
            return `<a href="${apiUrl}" target="_blank">📎 ${rawPath}</a>`;
        }
    });
}

export const VditorEditor = forwardRef<VditorEditorRef, VditorEditorProps>(
    ({ value, onChange, readOnly = false, placeholder, vault = "", fileLinks = {}, initialMode = "sv" }, ref) => {
        const { resolvedTheme } = useTheme();
        const { i18n } = useTranslation();
        const containerRef = useRef<HTMLDivElement>(null);
        const vditorRef = useRef<Vditor | null>(null);
        const contentRef = useRef(value);
        const [isReady, setIsReady] = useState(false);
        
        // 保存最新的 props 用于预览转换
        const propsRef = useRef({ vault, fileLinks, token: localStorage.getItem("token") || "" });
        propsRef.current = { vault, fileLinks, token: localStorage.getItem("token") || "" };

        const getVditorLang = useCallback(() => {
            const lang = i18n.language;
            if (lang.startsWith("zh")) return "zh_CN";
            if (lang.startsWith("ja")) return "ja_JP";
            if (lang.startsWith("ko")) return "ko_KR";
            return "en_US";
        }, [i18n.language]);

        useImperativeHandle(ref, () => ({
            getValue: () => {
                if (isReady && vditorRef.current) {
                    return vditorRef.current.getValue();
                }
                return contentRef.current;
            },
            setValue: (newValue: string) => {
                contentRef.current = newValue;
                if (isReady && vditorRef.current) {
                    vditorRef.current.setValue(newValue);
                }
            },
            exportPDF: () => {
                if (isReady && vditorRef.current) {
                    vditorRef.current.tip("PDF 导出功能开发中...", 2000);
                }
            },
            exportHTML: () => {
                if (isReady && vditorRef.current) {
                    const html = vditorRef.current.getHTML();
                    const blob = new Blob([`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Export</title></head><body>${html}</body></html>`], { type: "text/html" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "export.html";
                    a.click();
                    URL.revokeObjectURL(url);
                }
            },
        }), [isReady]);

        useEffect(() => {
            if (!containerRef.current) return;

            const vditor = new Vditor(containerRef.current, {
                value: contentRef.current,
                theme: resolvedTheme === "dark" ? "dark" : "classic",
                mode: "sv", // 分屏预览模式
                lang: getVditorLang(),
                placeholder: placeholder || "",
                height: "100%",
                cache: { enable: false },
                toolbar: readOnly ? [] : [
                    "headings",
                    "bold",
                    "italic",
                    "strike",
                    "link",
                    "|",
                    "list",
                    "ordered-list",
                    "check",
                    "quote",
                    "|",
                    "code",
                    "inline-code",
                    "table",
                    "line",
                    "|",
                    "upload",
                    "|",
                    "undo",
                    "redo",
                    "|",
                    "outline",
                    "edit-mode",
                    "preview",
                    "fullscreen",
                    "|",
                    "export",
                ],
                counter: {
                    enable: true,
                    type: "text",
                },
                outline: {
                    enable: true,
                    position: "right",
                },
                upload: {
                    // 图片上传使用 Obsidian 语法
                    accept: "image/*",
                    handler: (files: File[]) => {
                        if (!vditorRef.current) return null;
                        
                        files.forEach((file) => {
                            // 使用 Obsidian 的 ![[]] 语法
                            const markdown = `![[${file.name}]]`;
                            vditorRef.current?.insertValue(markdown);
                            // TODO: 实际项目中应该上传文件到服务器
                        });
                        return null;
                    },
                },
                preview: {
                    transform: (html: string) => {
                        // 在预览时转换 Obsidian 语法
                        const { vault, fileLinks, token } = propsRef.current;
                        return transformObsidianSyntax(html, vault, fileLinks, token);
                    },
                    hljs: {
                        enable: true,
                        lineNumber: true,
                        style: resolvedTheme === "dark" ? "native" : "github",
                    },
                    markdown: {
                        // 禁用 sanitize 以支持 base64 图片（data: 协议）
                        sanitize: false,
                    },
                },
                input: (val) => {
                    contentRef.current = val;
                    onChange?.(val);
                },
                after: () => {
                    vditorRef.current = vditor;
                    setIsReady(true);
                    if (readOnly) {
                        vditor.disabled();
                    }
                    // 如果是预览模式，切换到纯预览视图
                    if (initialMode === "preview") {
                        // 点击预览按钮进入纯预览模式
                        const previewBtn = containerRef.current?.querySelector('.vditor-toolbar [data-type="preview"]') as HTMLElement;
                        if (previewBtn) {
                            previewBtn.click();
                        }
                    }
                },
            });

            return () => {
                setIsReady(false);
                if (vditorRef.current) {
                    vditorRef.current.destroy();
                    vditorRef.current = null;
                }
            };
        }, []);

        useEffect(() => {
            if (isReady && vditorRef.current) {
                vditorRef.current.setTheme(
                    resolvedTheme === "dark" ? "dark" : "classic",
                    resolvedTheme === "dark" ? "dark" : "light",
                    resolvedTheme === "dark" ? "native" : "github"
                );
            }
        }, [resolvedTheme, isReady]);

        useEffect(() => {
            if (isReady && vditorRef.current && value !== contentRef.current) {
                contentRef.current = value;
                vditorRef.current.setValue(value);
            }
        }, [value, isReady]);

        useEffect(() => {
            if (isReady && vditorRef.current) {
                if (readOnly) {
                    vditorRef.current.disabled();
                } else {
                    vditorRef.current.enable();
                }
            }
        }, [readOnly, isReady]);

        return <div ref={containerRef} className="vditor-container h-full" />;
    }
);

VditorEditor.displayName = "VditorEditor";
