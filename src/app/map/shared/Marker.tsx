"use client";
import { Marker } from "react-map-gl";
import { PointFeature } from "supercluster";
import Image from "next/image";

import type { MarkerProps } from "react-map-gl";
import React from "react";

export default function Component({
  poi,
  markerProps,
  title,
  icon,
}: {
  poi: PointFeature<any>;
  markerProps: MarkerProps;
  title: string;
  icon?: string;
}) {
  return (
    <Marker {...markerProps}>
      <div
        style={
          {
            // display: "flex",
            // flexDirection: "column",
          }
        }
      >
        <Image
          src={icon ?? "/images/mapbox-marker-icon-red.svg"}
          alt="Point of Interest"
          fill
          style={{
            objectFit: "contain",
          }}
        />
        {title}
      </div>
    </Marker>
  );
}
