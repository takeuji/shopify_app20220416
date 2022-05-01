import { useState } from "react";
import {
  Page,
  Layout,
  EmptyState,
  useIndexResourceState,
} from "@shopify/polaris";
import { ResourcePicker, TitleBar } from "@shopify/app-bridge-react";

const img = "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg";

export function EmptyStatePage({ setSelection }) {
  const [open, setOpen] = useState(false);
  const handleSelection = (resoureces) => {
    setOpen(false);
    setSelection(resoureces.selection.map((product) => product.id));
  };
  return (
    <Page>
      <TitleBar
        primaryAction={{
          content: "Select products",
          onAction: () => setOpen(true),
        }}
      />
      <ResourcePicker
        resourceType={"Product"}
        showVariants={false}
        open={open}
        onSelection={(resources) => handleSelection(resources)}
        onCancel={() => setOpen(false)}
      />
      <Layout>
        <Layout.Section>
          <EmptyState
            heading="Discount your products temporarily"
            action={{
              content: "Select products",
              onAction: () => setOpen(true),
            }}
            image={img}
            imageContained
          >
            <p>Select products to change their price temporarily.</p>
          </EmptyState>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
