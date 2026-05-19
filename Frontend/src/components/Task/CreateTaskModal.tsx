"use client";

import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
// services API
import api from "@/services/api";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    members: any[];
    onTaskCreated: () => void;
}
// Modal pour créer une nouvelle tâche
export default function CreateTaskModal({
    isOpen,
    onClose,
    projectId,
    members,
    onTaskCreated,
}: Props) {
    // États pour les champs du formulaire
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] = useState("TODO");
    const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    // Création de la tâche via l'API
    const handleCreateTask = async () => {
        if (assigneeIds.length === 0) {
            alert("Veuillez attribuer la tâche à au moins un collaborateur.");
            return;
        }

        try {
            setLoading(true);
            await api.post(`/projects/${projectId}/tasks`, {
                title,
                description,
                dueDate,
                assigneeIds,
                priority: "MEDIUM",
                status,
            });
            onTaskCreated();
            onClose();
            // Réinitialisation des champs
            setTitle("");
            setDescription("");
            setDueDate("");
            setStatus("TODO");
            setAssigneeIds([]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Bascule l'assignation d'un membre
    const toggleAssignee = (id: string) => {
        setAssigneeIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-4">
            <div className="relative w-full max-w-[520px] rounded-[10px] bg-white p-8 shadow-2xl">
                <button onClick={onClose} className="absolute right-6 top-6 text-2xl text-gray-400 transition-all hover:text-black">
                    <X size={22} />
                </button>

                <h2 className="mb-10 text-[26px] text-[#1f1f1f]">Créer une tâche</h2>

                <div className="space-y-7">
                    <div>
                        <label className="mb-3 block text-[16px] text-[#1f1f1f]">Titre*</label>
                        <input type="text" value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        className="h-[58px] w-full rounded-[12px] border border-[#e7e7e7] px-5 outline-none" />
                    </div>

                    <div>
                        <label className="mb-3 block text-[16px] text-[#1f1f1f]">Description*</label>
                        <textarea value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        className="h-[58px] w-full rounded-[12px] border border-[#e7e7e7] p-5 outline-none" />
                    </div>

                    <div>
                        <label className="mb-3 block text-[16px] text-[#1f1f1f]">Échéance*</label>
                        <input type="date" value={dueDate} 
                        onChange={(e) => setDueDate(e.target.value)} 
                        className="h-[58px] w-full rounded-[12px] border border-[#e7e7e7] px-5 outline-none" />
                    </div>

                    <div>
                        <label className="mb-3 block text-[16px] text-[#1f1f1f]">Assigné à : *</label>
                        <div className="rounded-[12px] border border-[#e7e7e7] p-4">
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-[#8b8f98]">Choisir un ou plusieurs collaborateurs</span>
                                <ChevronDown size={18} />
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {members.map((member: any) => (
                                    <button key={member.user.id} type="button" onClick={() => toggleAssignee(member.user.id)} className={`rounded-full px-4 py-2 text-[14px] transition-all ${assigneeIds.includes(member.user.id) ? "bg-[#d45d00] text-white" : "bg-[#f3f3f5] text-[#1f1f1f]"}`}>
                                        {member.user.name || member.user.email}
                                    </button>
                                ))}
                            </div>
                            {assigneeIds.length === 0 && <p className="mt-3 text-sm text-red-500">Veuillez sélectionner au moins un collaborateur.</p>}
                        </div>
                    </div>

                    <div>
                        <label className="mb-4 block text-[16px] text-[#1f1f1f]">Statut :</label>
                        <div className="flex items-center gap-3 flex-wrap">
                            <button type="button" 
                            onClick={() => setStatus("TODO")} 
                            className={`rounded-full px-5 py-2 text-[14px] ${status === "TODO" ? "bg-[#ef4444] text-white" : "bg-[#fdecec] text-[#ef4444]"}`}>À faire</button>
                            <button type="button" 
                            onClick={() => setStatus("IN_PROGRESS")} 
                            className={`rounded-full px-5 py-2 text-[14px] ${status === "IN_PROGRESS" ? "bg-[#f59e0b] text-white" : "bg-[#fff3e8] text-[#f59e0b]"}`}>En cours</button>
                            <button type="button" 
                            onClick={() => setStatus("DONE")} 
                            className={`rounded-full px-5 py-2 text-[14px] ${status === "DONE" ? "bg-[#22c55e] text-white" : "bg-[#eaf8ef] text-[#22c55e]"}`}>Terminée</button>
                        </div>
                    </div>

                    <button onClick={handleCreateTask} disabled={loading || assigneeIds.length === 0} className="mt-6 h-[58px] rounded-[14px] bg-[#1f1f1f] px-8 text-[16px] font-medium text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
                        {loading ? "Création..." : "+ Ajouter une tâche"}
                    </button>
                </div>
            </div>
        </div>
    );
}