"use client";
import Head from "next/head";
import { useAppDispatch } from "@/redux";
import { updateData } from "@/redux/search/slice";
import { useEffect } from "react";

export default function Page({ visualStyles }: { visualStyles: any }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(updateData(visualStyles));
  }, [dispatch, visualStyles]);

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    null
  );
}
