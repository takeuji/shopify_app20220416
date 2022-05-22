import React, { useState } from "react";
import {
  Button,
  Page,
  Layout,
  EmptyState,
  Card,
  Banner,
  useIndexResourceState,
} from "@shopify/polaris";
import { ResourcePicker, TitleBar } from "@shopify/app-bridge-react";
import FileUploader from "./FileUploader.jsx";
import Papa from "papaparse";
import "./fileupload.css";

const img = "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg";

export function EmptyStatePage({ setSelection }) {
  const [open, setOpen] = useState(false);
  const [isSetCSVFile, setIsSetCSVFile] = useState(false);
  const [uploadCSVFile, setUploadCSVFile] = useState(null);
  const [failUpload, setFailUpload] = useState(false);
  const [failMessage, setFailMessage] = useState("");

  const handleSelection = (resoureces) => {
    setOpen(false);
    setSelection(resoureces.selection.map((product) => product.id));
  };

  /**
   * アップロードするCSVファイルを設定する処理
   * (ファイルを選択 ボタンでファイルが選択された時)
   * @param files ファイルリストオブジェクト
   */
  const setCSV = (files) => {
    console.log("setCSV");
    setFailUpload(false);
    setIsSetCSVFile(false);
    setUploadCSVFile(null);
    try {
      if (files.length === 0) {
        return;
      }
    } catch (e) {
      console.log(`setCSV: ${e.log}`);
      return;
    }
    const file = files[0];
    const csvExtensions = ["CSV", "csv"];
    if (
      csvExtensions.indexOf(file.name.slice(file.name.lastIndexOf(".") + 1)) ===
      -1
    ) {
      console.log("extension is not csv");
      setFailMessage("拡張子が.csvではありません。");
      setFailUpload(true);
      return;
    }

    console.log("set file");
    setIsSetCSVFile(true);
    setUploadCSVFile(file);
  };

  /**
   * CSVをアップロード(読み込む)する処理
   */
  const uploadCSV = () => {
    const setErrorMsg = () => {
      setFailMessage(
        "アップロードに失敗しました。もう一度アップロードしてください。"
      );
      setFailUpload(true);
      setIsSetCSVFile(false);
    };
    const reader = new FileReader();
    reader.onload = (event) => {
      const ret = readCSV(event.target.result);
      if (!ret) {
        setErrorMsg();
      }
    };
    reader.onerror = () => {
      setErrorMsg();
    };
    reader.readAsText(uploadCSVFile);
  };

  /**
   * CSVファイルを読み込む処理
   * @param csvdata CSVファイルのデータ
   */
  const readCSV = (csvdata) => {
    try {
      Papa.parse(csvdata, {
        step: (results, parser) => {
          console.log("step");
          console.log(results.data);
        },
        complete: () => {
          console.log("complete");
        },
      });
      //delete(require.cache[path.resolve('csv-parser/index.js')]);
      // const stream = new csvParser();
      // stream.on("data", (data) => {
      //   console.log(data);
      // });
      // stream.write(csvdata);
    } catch (e) {
      return false;
    }
    return true;
  };

  return (
    <Page>
      <TitleBar
        breadcrumbs={[{ content: "商品管理(CSV)" }]}
        title="CSV２"
        primaryAction={{
          content: "CSVアップロード",
          onAction: () => setOpen(true),
        }}
      />
      <Card title="商品CSVダウンロード" sectioned>
        <p>全商品をCSVでダウンロードします</p>
        <Button primary textAlign="right">
          CSVダウンロード
        </Button>
      </Card>
      <Card title="商品CSVアップロード" sectioned>
        {failUpload && (
          <Banner title="アップロードに失敗" onDismiss={() => {}}>
            <p>{failMessage}</p>
          </Banner>
        )}
        <p>CSVをアップロードして、商品を新規登録・更新します</p>
        <FileUploader uploadCSV={setCSV} />
        <Button
          primary
          textAlign="right"
          disabled={!isSetCSVFile}
          onClick={uploadCSV}
        >
          選択されたファイルで商品登録・更新
        </Button>
      </Card>
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
