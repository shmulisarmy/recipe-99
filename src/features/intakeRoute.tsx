import { createSignal, Show, createEffect, on } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { useMutation, useAction, useQuery } from "convex-solidjs";
import { api } from "../../convex/_generated/api";
import type { Doc, Id } from "../../convex/_generated/dataModel";
import type { Measurement } from "../primitives/measurement";
import { AvailableIngredientsBulkAddForm, type IntakeHandoff } from "./available_ingredients_bulk_add_form/outside_feature_exports";
import { LoadingAnimation } from "../components/loading_animation";
import { CameraView } from "./take_image";
import { UploadFile } from "../utils/upload_file";
import { readReceiptOcr, warmReceiptOcr, type ReceiptOcrLoadState } from "./receipt_ocr/receipt_ocr";
import LoadingReceiptOcr from "./receipt_ocr/loading_component";

function convertIngredientsDataStructure(
    ingredients: Doc<"initialIngredientBulkAddFormDraft">["ingredients"],
  ) {
    const result: Record<string, Measurement> = {};
    for (const ingredient of ingredients) {
      const { name, measurement } = ingredient;
      const { amount, unit } = measurement;
      if (amount === undefined || !unit) continue;
      result[name] = { amount, unit };
    }
    return result;
  }

  function LiveGeneratedIntakeForm(props: {
    draftId: Id<"initialIngredientBulkAddFormDraft">;
    onComplete: (handoff: IntakeHandoff) => void;
  }) {
    const draft = useQuery(
        api.agents.initialIngredientBulkAddFormDraftAgent.getDraft,
        { draftId: props.draftId },
    );
    createEffect(() => {
      const d= draft.data();
      if (d) console.log("draft", d);
    });

    return (
      <Show
        when={draft.data()}
        keyed
        fallback={<p class="supporting-copy">Preparing your ingredient form…</p>}
      >
        {(draftData) => (
            <>
            <Show when={!draftData.isDoneInitialGeneration}>
              <span>the agent is still working on your ingredients</span>
            </Show>
          <AvailableIngredientsBulkAddForm
            ingredientsToAdd={convertIngredientsDataStructure(draftData.ingredients)}
            onComplete={props.onComplete}
            />
            </>
        )}
      </Show>
    );
  }


  export default function IntakeRoute(props: { onComplete: (handoff: IntakeHandoff) => void }) {
    const [searchParams] = useSearchParams<{ notice?: string }>();
    const [image, setImage] = createSignal<Blob|undefined>();
    const generateImageUploadUrl = useMutation(
        api.agents.imageUtils.generateImageUploadUrl,
    );
    const [uploadUrl, setUploadUrl] = createSignal<string>("");
    generateImageUploadUrl.mutate({}).then(setUploadUrl)
    let action = useAction(
        api.agents.initialIngredientBulkAddFormDraftAgent
            .getAgentToMakeInitialIngredientBulkAddFormDraft,
    );



    createEffect(on([image, uploadUrl], ([capturedImage, uploadUrl]) => {
      if (!capturedImage) return;
      void (async () => {
        if (!uploadUrl) return;
        const [ocrText, storageId] = await Promise.all([readReceiptOcr(capturedImage), UploadFile(uploadUrl, capturedImage)]);
        console.log("storageId", storageId);
        console.log("ocrText", ocrText);
        await action.mutate({
          userSuppliedContext: "Read every ingredient and measurement visible in this image.",
          imageId: storageId,
          ocrText
        });
        console.log("action", action);
      })();
    }));


    return (
      <>
      <LoadingReceiptOcr/>
        <Show when={searchParams.notice === "handoff"}>
          <div class="route-notice inline-notice notice-neutral">
            Start or finish a pantry batch before reconciling today’s cart.
          </div>
        </Show>
        <Show when={!image()}>
        <CameraView
            ImageSetter={setImage}
            styles={{
              width: "22rem",
              "max-width": "100%",
              "aspect-ratio": "1 / 2",
              "object-fit": "cover",
              "border-radius": "1rem",
            }}
            />

          </Show>

        <Show when={image() && !action.data()}>
          <LoadingAnimation/>
        </Show>

        <Show when={action.data()}>
          {(data) => (
            <>
              <span>{data().text}</span>
              <LiveGeneratedIntakeForm
                draftId={data().draftId}
                onComplete={props.onComplete}
              />
            </>
          )}
        </Show>
      </>
    );
  }
