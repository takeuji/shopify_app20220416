import React, { useState, useCallback } from "react";
import {
  Button,
  Page,
  Layout,
  Frame,
  EmptyState,
  Card,
  Banner,
  Toast,
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
  const [successUpload, setSuccessUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSelection = (resoureces) => {
    setOpen(false);
    setSelection(resoureces.selection.map((product) => product.id));
  };

  const resetStatus = () => {
    setFailUpload(false);
    setIsSetCSVFile(false);
    setUploadCSVFile(null);
    setFailUpload(false);
    setSuccessUpload(false);
  };

  /**
   * アップロードするCSVファイルを設定する処理
   * (ファイルを選択 ボタンでファイルが選択された時)
   * @param files ファイルリストオブジェクト
   */
  const setCSV = (files) => {
    console.log("setCSV");
    resetStatus();
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
  const uploadCSV = (e) => {
    const setErrorMsg = () => {
      setFailMessage(
        "アップロードに失敗しました。もう一度アップロードしてください。"
      );
      setFailUpload(true);
      setIsSetCSVFile(false);
    };
    console.log("click");

    try {
      Papa.parse(uploadCSVFile, {
        step: (results, parser) => {
          console.log("step");
          console.log(results.data);
        },
        error: function (err, _file, _inputElem, reason) {
          console.log("err");
          console.log(err);
          console.log("reason");
          console.log(reason);
          setErrorMsg();
        },
        complete: () => {
          console.log("complete");
          setSuccessUpload(true);
          toggleActive();
        },
      });
    } catch (e) {
      setErrorMsg();
    }
  };

  /**
   * CSVファイルを読み込む処理
   * @param csvdata CSVファイルのデータ
   */
  const readCSV = (csvdata) => {
    try {
      console.log(csvdata);
      // 初めに全体を読む
      const ret = Papa.parse(csvdata);
      Papa.parse(csvdata, {
        step: (results, parser) => {
          console.log("step");
          console.log(results.data);
        },
        complete: () => {
          console.log("complete");
        },
      });
    } catch (e) {
      return false;
    }
    return true;
  };

  const [toastActive, setToastActive] = useState(false);
  const toggleActive = useCallback(
    () => setToastActive((toastActive) => !toastActive),
    []
  );

  const toastMarkup = toastActive ? (
    <Toast content="CSVをアップロードしました" onDismiss={toggleActive} />
  ) : null;

  return (
    <Page>
      <Frame>
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
        {toastMarkup}
      </Frame>
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
