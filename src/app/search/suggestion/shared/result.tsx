"use client";
import Head from "next/head";
import { useAppSelector } from "@/redux";
import utilStyles from "../../../utils.module.css";
import { selectSearchResult } from "@/redux/search/slice";
import { DATA_KEY_LIST, DataKey } from "@/redux/search/type";

export default function Page() {
  const results = useAppSelector(selectSearchResult);

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
      <h2 className={utilStyles.headingLg}>Result</h2>
      <table className="table-auto w-full border">
        <thead>
          <tr className="">
            <th
              key={`result-number`}
              className="table-cell border border-slate-300"
            >
              number
            </th>
            {DATA_KEY_LIST.map((key) => (
              <th
                key={`result-${key}`}
                className="table-cell border border-slate-300"
              >
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((row, index) => (
            <tr key={`result-${index}-row`} className="h-20">
              <td key="number" className="w-0 border border-slate-300">
                {index + 1}
              </td>
              {DATA_KEY_LIST.map((key) => (
                <td key={key} className="w-10 border border-slate-300">
                  {row[key].values.join(", ")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
