"use client";
import Map, { MapRef, Layer, Popup, CustomLayerInterface } from "react-map-gl";
import type { FillLayer, MarkerProps } from "react-map-gl";
import SuperCluster, { PointFeature } from "supercluster";
import { ThreeboxLayer, EiffelTowerLayer } from "./three-plugin";
// import { useThree, useLoader } from "@react-three/fiber";

import "mapbox-gl/dist/mapbox-gl.css";
import React, { useCallback, useState } from "react";
import Marker from "./Marker";
import mapboxgl from "mapbox-gl";

export default function Page({ POI, layerID }: { POI: any; layerID: string }) {
  const [clusters, setClusters] = useState<PointFeature<any>[]>([]);
  const mapboxRef = React.useRef<MapRef>(null);
  const clusterRef = React.useRef<SuperCluster<any, any> | null>(null);
  // const popupRef = React.useRef<Array<mapboxgl.Popup | null>>([]);
  const [popup, setPopup] = useState<{
    longitude: number;
    latitude: number;
    name: string;
  } | null>(null);
  // const {} = useLoader(
  //   Threebox,
  //   "https://raw.githubusercontent.com/jscastro76/threebox/master/dist/threebox.js"
  // );

  // var clusters = index.getClusters([-180, -85, 180, 85], 2);
  // useCallback((feature, latlng) => {
  //   if (!mapboxRef.current) return;
  //   //
  //   if (!feature.properties.cluster) return L.marker(latlng);

  //   const count = feature.properties.point_count;
  //   const size = count < 100 ? "small" : count < 1000 ? "medium" : "large";
  //   const icon = L.divIcon({
  //     html: `<div><span>${feature.properties.point_count_abbreviated}</span></div>`,
  //     className: `marker-cluster marker-cluster-${size}`,
  //     iconSize: L.point(40, 40),
  //   });

  //   return L.marker(latlng, { icon });
  // }, []);
  const loadCluster = useCallback(() => {
    const index = new SuperCluster<
      {
        category: string;
        name: string;
        icon: string;
      },
      any
    >({
      log: true,
    }).load(POI.features);
    clusterRef.current = index;
  }, [POI.features]);

  const updateCluster = useCallback(() => {
    const map = mapboxRef.current?.getMap();
    const index = clusterRef.current;
    if (map && index) {
      //update
      const bounds = mapboxRef.current!.getMap().getBounds().toArray().flat();
      const zoom = mapboxRef.current!.getMap().getZoom();

      if (bounds.length === 4 || (bounds.length === 6 && clusterRef.current)) {
        const newClusters = index.getClusters(
          bounds as [number, number, number, number],
          zoom
        );

        setClusters(newClusters);
      }
    }
  }, []);

  const onExpandCluster = useCallback(
    (clusterId: number, coordinates: number[]) => () => {
      const map = mapboxRef.current?.getMap();
      const index = clusterRef.current;
      const [longitude, latitude] = coordinates;

      if (map && index) {
        const expansionZoom = index.getClusterExpansionZoom(clusterId);

        map.flyTo({
          animate: true,
          speed: 2,
          center: [longitude, latitude],
          zoom: expansionZoom,
          duration: 1000,
        });
      }
    },
    []
  );

  const _renderClusterMarker = useCallback(
    (cluster: PointFeature<any>, index: number) => {
      const [longitude, latitude] = cluster.geometry.coordinates;

      const { cluster: isCluster, point_count: pointCount } =
        cluster.properties;
      const clusterId = cluster.properties.cluster_id;
      const clusterCount = cluster.properties.point_count_abbreviated;

      return (
        <Marker
          key={`cluster-${clusterId}`}
          markerProps={{
            longitude,
            latitude,
            onClick: onExpandCluster(clusterId, [longitude, latitude]),
          }}
          poi={cluster}
          title={pointCount}
          icon="/images/mapbox-marker-icon-blue.svg"
        />
      );
    },
    [onExpandCluster]
  );

  const _renderPOIMarker = useCallback(
    (poi: PointFeature<any>, index: number) => {
      const { name, icon } = poi.properties;
      const [longitude, latitude] = poi.geometry.coordinates;

      return (
        <Marker
          key={`poi-${name}-${Math.random()}`}
          markerProps={{
            longitude,
            latitude,
            // popup: new mapboxgl.Popup({
            //   closeButton: true,
            //   closeOnClick: true,
            //   closeOnMove: true,
            //   offset: 5,
            // })
            //   .setLngLat([longitude, latitude])
            //   .setHTML(`<p>${name}</p>`),
            onClick: () => setPopup({ longitude, latitude, name }),
          }}
          poi={poi}
          title={name}
          icon={icon}
        />
      );
    },
    []
  );

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <Map
      ref={mapboxRef}
      mapboxAccessToken="pk.eyJ1IjoibGliZXJ0eS12aW5vdmEiLCJhIjoiY2xwcjBud2syMDM3bDJydXU1N290ZXlqcSJ9.pTuv4I0dm4MHAiSsn7e9AA"
      initialViewState={{
        longitude: 103.8233,
        latitude: 1.2514,
        zoom: 12,
        // zoom: 14,
      }}
      style={{ width: "100vw", height: "90vh" }}
      mapStyle="mapbox://styles/liberty-vinova/clq4usc0j020e01o0g0ljgxtz"
      onMoveEnd={updateCluster}
      onLoad={() => {
        loadCluster();
        updateCluster();
        //
        const map = mapboxRef.current?.getMap();
        if (map) {
          map.addControl(new mapboxgl.NavigationControl());
          // Add geolocate control to the map.
          map.addControl(
            new mapboxgl.GeolocateControl({
              positionOptions: {
                enableHighAccuracy: true,
              },
              trackUserLocation: true,
            })
          );
        }
      }}
    >
      {/* <Layer {...ThreeboxLayer} /> */}
      <Layer {...EiffelTowerLayer} />
      {clusters.map((cluster, index) => {
        const { cluster: isCluster } = cluster.properties;
        // we have a cluster to render
        if (isCluster) {
          return _renderClusterMarker(cluster, index);
        }

        // we have a single point (crime) to render
        return _renderPOIMarker(cluster, index);
      })}
      {popup && (
        <Popup
          key={`popup-${Math.random()}`}
          // ref={(ref) => (popupRef.current[index] = ref)}
          longitude={popup.longitude}
          latitude={popup.latitude}
          anchor="bottom"
          closeButton={true}
          closeOnClick={false}
          closeOnMove
          offset={5}
          focusAfterOpen
          onClose={() => {
            setPopup(null);
          }}
        >
          {popup.name}
        </Popup>
      )}
    </Map>
  );
}
