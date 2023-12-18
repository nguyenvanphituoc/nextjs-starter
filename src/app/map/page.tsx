import Map from "react-map-gl";
import React from "react";
import MapBox from "./shared/mapbox";
import Threejs from "./shared/threejs";

const fetchingDataSet = async () => {
  const mapboxUrl =
    "https://api.mapbox.com/datasets/v1/{username}/{dataset_id}/features?access_token={access_token}&limit=100";
  const username = "liberty-vinova";
  const datasetId = "clq4sxmg32io71tucz1ovfr2n";
  const pkToken =
    "pk.eyJ1IjoibGliZXJ0eS12aW5vdmEiLCJhIjoiY2xwcjBud2syMDM3bDJydXU1N290ZXlqcSJ9.pTuv4I0dm4MHAiSsn7e9AA";
  const layerID = "sentosa-poi";

  const reqUrl = mapboxUrl
    .replace("{username}", username)
    .replace("{dataset_id}", datasetId)
    .replace("{access_token}", pkToken);
  //
  const response = await fetch(reqUrl);
  const data = await response.json();

  return data;
};

export default async function Page() {
  const data = await fetchingDataSet();
  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <MapBox POI={data} layerID="sentosa-poi" />
    // <Threejs />
  );
}
