"use client";
import dynamic from "next/dynamic";

const Inner = dynamic(() => import("./LocationPickerInner"), { ssr: false });

export default function LocationPicker(props: {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
}) {
  return <Inner {...props} />;
}
