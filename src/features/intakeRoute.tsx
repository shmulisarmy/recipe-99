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
        fallback={<p class="supporting-copy">Preparing your ingredient draft…</p>}
      >
        {(draftData) => (
            <>
            <Show when={!draftData.isDoneInitialGeneration}>
              <p class="supporting-copy" aria-live="polite">
                More ingredients may appear as the receipt is read. Review and adjust what's here.
              </p>
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
        <Show when={!action.data()}>
          <main class="main workspace-narrow intake-capture-page" id="main">
            <div class="stepper" aria-label="Intake progress">
              <div class="step active" aria-current="step">
                1 Review ingredients
              </div>
              <div class="step">2 Reconcile today’s cart</div>
            </div>
            <header class="page-heading">
              <div>
                <h1>Add a batch</h1>
                <p class="supporting-copy">
                  Capture a receipt, then review every ingredient before updating the pantry.
                </p>
              </div>
            </header>
            <Show when={searchParams.notice === "handoff"}>
              <div class="route-notice inline-notice notice-neutral">
                Start or finish a pantry batch before reconciling today’s cart.
              </div>
            </Show>
            <Show
              when={!image()}
              fallback={
                <section
                  class="intake-processing"
                  aria-labelledby="intake-processing-heading"
                  aria-live="polite"
                  role="status"
                >
                  <div>
                    <h2 id="intake-processing-heading">Reading your receipt</h2>
                    <p class="supporting-copy">
                      Finding ingredients and amounts. You’ll review the draft before anything is added.
                    </p>
                  </div>
                  <LoadingAnimation/>
                </section>
              }
            >
              <section class="capture-workspace" aria-labelledby="capture-heading">
                <div class="capture-guidance">
                  <h2 id="capture-heading">Photograph the full receipt</h2>
                  <p>
                    Hold it straight inside the frame with the item names and amounts in focus.
                  </p>
                  <ul class="capture-checklist">
                    <li>Use even light and avoid glare.</li>
                    <li>Include the top and bottom edges.</li>
                    <li>Press the round shutter when the text is clear.</li>
                  </ul>
                  <p class="helper-text">
                    The receipt is used to prepare an editable ingredient draft.
                  </p>
                </div>
                <div class="capture-camera">
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
                  <p class="capture-caption">Fit the entire receipt inside the frame.</p>
                </div>
              </section>
            </Show>
          </main>
        </Show>

        <Show when={action.data()}>
          {(data) => (
            <LiveGeneratedIntakeForm
              draftId={data().draftId}
              onComplete={props.onComplete}
            />
          )}
        </Show>
      </>
    );
  }
