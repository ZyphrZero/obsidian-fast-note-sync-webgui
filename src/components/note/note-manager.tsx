import { handleVault } from "@/components/api-handle/vault-handle";
import { VaultType } from "@/lib/types/vault";
import { useState, useEffect } from "react";
import { Note } from "@/lib/types/note";

import { NoteEditor } from "./note-editor";
import { NoteList } from "./note-list";


interface NoteManagerProps {
    vault?: string;
    onVaultChange?: (vault: string) => void;
}

export function NoteManager({ vault = "defaultVault", onVaultChange }: NoteManagerProps) {
    const [view, setView] = useState<"list" | "editor">("list");
    const [mode, setMode] = useState<"view" | "edit">("view");
    const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined);
    const [vaults, setVaults] = useState<VaultType[]>([]);
    const { handleVaultList } = handleVault();

    useEffect(() => {
        handleVaultList((data) => {
            setVaults(data);
        });
    }, []);

    const handleSelectNote = (note: Note, mode: "view" | "edit") => {
        setSelectedNote(note);
        setMode(mode);
        setView("editor");
    };

    const handleCreateNote = () => {
        setSelectedNote(undefined);
        setMode("edit");
        setView("editor");
    };

    const handleBack = () => {
        setView("list");
        setSelectedNote(undefined);
    };

    const handleSaveSuccess = () => {
        setView("list");
        setSelectedNote(undefined);
    };

    const handleEdit = () => {
        setMode("edit");
    };

    if (view === "editor") {
        return (
            <NoteEditor
                vault={vault}
                note={selectedNote}
                mode={mode}
                onBack={handleBack}
                onSaveSuccess={handleSaveSuccess}
                onEdit={handleEdit}
            />
        );
    }

    return (
        <NoteList
            vault={vault}
            vaults={vaults}
            onVaultChange={onVaultChange}
            onSelectNote={handleSelectNote}
            onCreateNote={handleCreateNote}
        />
    );
}
