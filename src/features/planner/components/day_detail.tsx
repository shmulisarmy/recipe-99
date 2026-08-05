import { createSignal, type JSX } from "solid-js";
import { useMutation } from "convex-solidjs";
import type { RecipeProjection } from "./types";
import { api } from "../../../../convex/_generated/api";

function dayLabel(dateStr: string): string {
    const date = new Date(dateStr);
    const today = new Date();
    const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const dayMs = 24 * 60 * 60 * 1000;
    const diff = Math.round((startOfDay(date) - startOfDay(today)) / dayMs);
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    return date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}

export function DayDetail(props: {
    dateStr: string; // toDateString() key
    recipes: RecipeProjection[];
    cartCount: number | undefined;
    onOpenRecipe: (item: RecipeProjection) => void;
    onOpenCart: () => void;
}): JSX.Element {
    const [isDragOver, setIsDragOver] = createSignal(false);
    const date = () => new Date(props.dateStr);
    const insertRecipeAtBeginningOfDate = useMutation(
        api.planner_exports.InsertRecipeAtBeginningOfDate,
    );

    const handleDragOver = (event: DragEvent) => {
        event.preventDefault();
        if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
        setIsDragOver(true);
    };

    const handleDragLeave = (event: DragEvent) => {
        if (!(event.currentTarget as Element).contains(event.relatedTarget as Node)) {
            setIsDragOver(false);
        }
    };

    const handleDrop = async (event: DragEvent) => {
        event.preventDefault();
        setIsDragOver(false);
        const draggedId = event.dataTransfer?.getData("text/plain");
        if (!draggedId) return;
        await insertRecipeAtBeginningOfDate.mutate({
            recipeId: draggedId,
            toDate: date().toDateString(),
        });
    };

    void dayLabel;
    void isDragOver;
    void handleDragOver;
    void handleDragLeave;
    void handleDrop;

    return (<></>);
}
