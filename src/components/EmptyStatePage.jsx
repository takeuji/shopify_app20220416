import React, { useState, useCallback, useEffect } from "react";
import {
  Button,
  Page,
  Layout,
  Frame,
  Card,
  Banner,
  Toast,
  Spinner,
  useIndexResourceState,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import FileUploader from "./FileUploader.jsx";
import Papa from "papaparse";
import {
  CREATE_PRODUCTS_QUERY,
  GET_PRODUCT_BY_HANDLE_QUERY,
} from "../js/qraphQL.js";
import "./fileupload.css";
import { useQuery, useMutation } from "@apollo/client";
import { CSVProcessor } from "../js/csvProcessor.js";

export function EmptyStatePage({ setSelection }) {
  const app = useAppBridge();
  const [populateProducts, { loadingPopulate }] = useMutation(
    CREATE_PRODUCTS_QUERY
  );
  const { getProduct, loadingGet } = useQuery(GET_PRODUCT_BY_HANDLE_QUERY);

  const [isSetCSVFile, setIsSetCSVFile] = useState(false);
  const [uploadCSVFile, setUploadCSVFile] = useState(null);
  const [failUpload, setFailUpload] = useState(false);
  const [failMessage, setFailMessage] = useState("");
  const [successUpload, setSuccessUpload] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    console.log("load component");
    console.log(app.hostOrigin);
    console.log(CSVProcessor.loadCSVFormat());
  }, []);

  const resetStatus = () => {
    setFailUpload(false);
    setIsSetCSVFile(false);
    setUploadCSVFile(null);
    setFailUpload(false);
    setSuccessUpload(false);
    setIsUploading(false);
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

    try {
      setIsUploading(true);
      let loadLine = 1;
      let headData;
      Papa.parse(uploadCSVFile, {
        step: (results, parser) => {
          console.log(`load.. ${loadLine}`);
          if (loadLine === 1) {
            headData = results.data;
          }
          loadLine++;
          console.log("step");
          console.log(results.data);
        },
        error: function (err, _file, _inputElem, reason) {
          console.log(`err\n${err}`);
          console.log(`reason\n${reason}`);
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
    } finally {
      setIsUploading(false);
    }
  };

  const [toastActive, setToastActive] = useState(false);
  const toggleActive = useCallback(
    () => setToastActive((toastActive) => !toastActive),
    []
  );

  const toastMarkup = toastActive ? (
    <Toast content="CSVをアップロードしました" onDismiss={toggleActive} />
  ) : null;
  const sppinerMarkup = isUploading ? (
    <>
      <div>CSVをアップロード中です・・</div>
      <Spinner accessibilityLabel="Spinner example" size="large" />
    </>
  ) : null;

  return (
    <Page>
      <Frame>
        <TitleBar breadcrumbs={[{ content: "商品管理(CSV)" }]} title="CSV" />
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
        {sppinerMarkup}
        {toastMarkup}
      </Frame>
    </Page>
  );
}
