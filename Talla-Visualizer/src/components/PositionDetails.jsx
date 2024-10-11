import React from "react";
import { useGraph, ViewModes } from "../store/GraphContext.jsx";

export default function PositionDetails() {
  const { positionDetails, viewMode } = useGraph();
  return (
    <>
      {viewMode !== ViewModes.LINK && (
        <div className="grid grid-cols-2 gap-4 px-5 h-full custom-scrollbar">
          <div className="col-span-2">
            <label
              className="inline-flex flex-col w-full"
              aria-label="absolute time"
            >
              <span className="ml-2 font-semibold">abs_time:</span>
              <span className="ml-2 font-normal">
                {positionDetails?.abs_time}
              </span>
            </label>
          </div>

          <label className="inline-flex flex-col w-full" aria-label="group">
            <span className="ml-2 font-semibold">group:</span>
            <span className="ml-2 font-normal">{positionDetails?.group}</span>
          </label>
          <label className="inline-flex flex-col w-full" aria-label="person">
            <span className="ml-2 font-semibold">person:</span>
            <span className="ml-2 font-normal">{positionDetails?.person}</span>
          </label>

          <label className="inline-flex flex-col w-full" aria-label="area">
            <span className="ml-2 font-semibold">area:</span>
            <span className="ml-2 font-normal">{positionDetails?.area}</span>
          </label>
          <label className="inline-flex flex-col w-full" aria-label="trace">
            <span className="ml-2 font-semibold">trace:</span>
            <span className="ml-2 font-normal">{positionDetails?.trace}</span>
          </label>
          <label
            className="inline-flex flex-col w-full"
            aria-label="trace area"
          >
            <span className="ml-2 font-semibold">trace_area:</span>
            <span className="ml-2 font-normal">
              {positionDetails?.trace_area}
            </span>
          </label>

          <label className="inline-flex flex-col w-full" aria-label="tag id">
            <span className="ml-2 font-semibold">tag_id:</span>
            <span className="ml-2 font-normal">{positionDetails?.tag_id}</span>
          </label>
          <label className="inline-flex flex-col w-full" aria-label="time">
            <span className="ml-2 font-semibold">time:</span>
            <span className="ml-2 font-normal">{positionDetails?.time}</span>
          </label>

          <label className="inline-flex flex-col w-full" aria-label="epoch">
            <span className="ml-2 font-semibold">epoch:</span>
            <span className="ml-2 font-normal">{positionDetails?.epoch}</span>
          </label>
          <label className="inline-flex flex-col w-full" aria-label="slot">
            <span className="ml-2 font-semibold">slot:</span>
            <span className="ml-2 font-normal">{positionDetails?.slot}</span>
          </label>

          <label className="inline-flex flex-col w-full" aria-label="x_kf">
            <span className="ml-2 font-semibold">x_kf:</span>
            <span className="ml-2 font-normal">{positionDetails?.x_kf}</span>
          </label>
          <label className="inline-flex flex-col w-full" aria-label="vx_kf">
            <span className="ml-2 font-semibold">vx_kf:</span>
            <span className="ml-2 font-normal">{positionDetails?.vx_kf}</span>
          </label>

          <label className="inline-flex flex-col w-full" aria-label="y_kf">
            <span className="ml-2 font-semibold">y_kf:</span>
            <span className="ml-2 font-normal">{positionDetails?.y_kf}</span>
          </label>
          <label className="inline-flex flex-col w-full" aria-label="vy_kf">
            <span className="ml-2 font-semibold">vy_kf:</span>
            <span className="ml-2 font-normal">{positionDetails?.vy_kf}</span>
          </label>

          <label className="inline-flex flex-col w-full" aria-label="z_kf">
            <span className="ml-2 font-semibold">z_kf:</span>
            <span className="ml-2 font-normal">{positionDetails?.z_kf}</span>
          </label>
          <label className="inline-flex flex-col w-full" aria-label="vz_kf">
            <span className="ml-2 font-semibold">vz_kf:</span>
            <span className="ml-2 font-normal">{positionDetails?.vz_kf}</span>
          </label>
          <label className="inline-flex flex-col w-full" aria-label="z">
            <span className="ml-2 font-semibold">z:</span>
            <span className="ml-2 font-normal">{positionDetails?.z}</span>
          </label>

          <label className="inline-flex flex-col w-full" aria-label="x">
            <span className="ml-2 font-semibold">x:</span>
            <span className="ml-2 font-normal">{positionDetails?.x}</span>
          </label>
          <label className="inline-flex flex-col w-full" aria-label="y">
            <span className="ml-2 font-semibold">y:</span>
            <span className="ml-2 font-normal">{positionDetails?.y}</span>
          </label>

          <label
            className="inline-flex flex-col w-full"
            aria-label="number of anchors"
          >
            <span className="ml-2 font-semibold">num_anchors:</span>
            <span className="ml-2 font-normal">
              {positionDetails?.num_anchors}
            </span>
          </label>
          <label
            className="inline-flex flex-col w-full"
            aria-label="anchor synchronization"
          >
            <span className="ml-2 font-semibold">anchor_synch:</span>
            <span className="ml-2 font-normal">
              {positionDetails?.anchor_synch}
            </span>
          </label>
          <label
            className="inline-flex flex-col w-full"
            aria-label="anchor reference"
          >
            <span className="ml-2 font-semibold">anchor_ref:</span>
            <span className="ml-2 font-normal">
              {positionDetails?.anchor_ref}
            </span>
          </label>

          <div className="col-span-2">
            <label
              className="inline-flex flex-col w-full"
              aria-label="anchor receiver"
            >
              <span className="ml-2 font-semibold">anchor_rec:</span>
              <span className="ml-2 font-normal">
                {positionDetails?.anchor_rec}
              </span>
            </label>
          </div>

          <label
            className="inline-flex flex-col w-full"
            aria-label="synchronization epoch"
          >
            <span className="ml-2 font-semibold">synch_epoch:</span>
            <span className="ml-2 font-normal">
              {positionDetails?.synch_epoch}
            </span>
          </label>
          <label
            className="inline-flex flex-col w-full"
            aria-label="synchronization slot"
          >
            <span className="ml-2 font-semibold">synch_slot:</span>
            <span className="ml-2 font-normal">
              {positionDetails?.synch_slot}
            </span>
          </label>
          <label
            className="inline-flex flex-col w-full"
            aria-label="server poll delay"
          >
            <span className="ml-2 font-semibold">server_poll_delay:</span>
            <span className="ml-2 font-normal">
              {positionDetails?.server_poll_delay}
            </span>
          </label>

          <div className="col-span-2">
            <label
              className="inline-flex flex-col w-full"
              aria-label="tdoa distance"
            >
              <span className="ml-2 font-semibold">tdoa_dist:</span>
              <span className="ml-2 font-normal">
                {positionDetails?.tdoa_dist}
              </span>
            </label>
          </div>

          <label
            className="inline-flex flex-col w-full"
            aria-label="reference receiver power"
          >
            <span className="ml-2 font-semibold">ref_rxpwr:</span>
            <span className="ml-2 font-normal">
              {positionDetails?.ref_rxpwr}
            </span>
          </label>
          <label
            className="inline-flex flex-col w-full"
            aria-label="reference fp power"
          >
            <span className="ml-2 font-semibold">ref_fppwr:</span>
            <span className="ml-2 font-normal">
              {positionDetails?.ref_fppwr}
            </span>
          </label>

          <div className="col-span-2">
            <label
              className="inline-flex flex-col w-full"
              aria-label="receivers receiver power"
            >
              <span className="ml-2 font-semibold">receivers_rxpwr:</span>
              <span className="ml-2 font-normal">
                {positionDetails?.receivers_rxpwr}
              </span>
            </label>
          </div>

          <div className="col-span-2">
            <label
              className="inline-flex flex-col w-full"
              aria-label="receivers fp power"
            >
              <span className="ml-2 font-semibold">receivers_fppwr:</span>
              <span className="ml-2 font-normal">
                {positionDetails?.receivers_fppwr}
              </span>
            </label>
          </div>

          <label
            className="inline-flex flex-col w-full"
            aria-label="initial location"
          >
            <span className="ml-2 font-semibold">initial_loc:</span>
            <span className="ml-2 font-normal">
              {positionDetails?.initial_loc}
            </span>
          </label>
          <label className="inline-flex flex-col w-full" aria-label="cost">
            <span className="ml-2 font-semibold">cost:</span>
            <span className="ml-2 font-normal">{positionDetails?.cost}</span>
          </label>

          <div className="col-span-2">
            <label
              className="inline-flex flex-col w-full"
              aria-label="residuals"
            >
              <span className="ml-2 font-semibold">residuals:</span>
              <span className="ml-2 font-normal">
                {positionDetails?.residuals}
              </span>
            </label>
          </div>

          <label className="inline-flex flex-col w-full" aria-label="status">
            <span className="ml-2 font-semibold">status:</span>
            <span className="ml-2 font-normal">{positionDetails?.status}</span>
          </label>
          <label className="inline-flex flex-col w-full" aria-label="timeout">
            <span className="ml-2 font-semibold">timeout:</span>
            <span className="ml-2 font-normal">{positionDetails?.timeout}</span>
          </label>
          <label className="inline-flex flex-col w-full" aria-label="label">
            <span className="ml-2 font-semibold">label:</span>
            <span className="ml-2 font-normal">{positionDetails?.label}</span>
          </label>

          <label className="inline-flex flex-col w-full" aria-label="frame">
            <span className="ml-2 font-semibold">frame:</span>
            <span className="ml-2 font-normal">{positionDetails?.frame}</span>
          </label>
          <label className="inline-flex flex-col w-full" aria-label="seconds">
            <span className="ml-2 font-semibold">seconds:</span>
            <span className="ml-2 font-normal">{positionDetails?.seconds}</span>
          </label>
        </div>
      )}
      {viewMode === ViewModes.LINK && (
        
        <div className="grid grid-cols-2 gap-2 px-5  custom-scrollbar">
          <label
            className="inline-flex flex-col w-full"
            aria-label="anchor reference"
          >
            <span className="ml-2 font-semibold">anchor_ref:</span>
            <span className="ml-2 font-normal">
              {positionDetails?.anchor_ref}
            </span>
          </label>

          <div className="col-span-2">
            <label
              className="inline-flex flex-col w-full"
              aria-label="anchor receiver"
            >
              <span className="ml-2 font-semibold">anchor_rec:</span>
              <span className="ml-2 font-normal">
                {positionDetails?.anchor_rec}
              </span>
            </label>
          </div>
          <label
            className="inline-flex flex-col w-full"
            aria-label="reference receiver power"
          >
            <span className="ml-2 font-semibold">ref_rxpwr:</span>
            <span className="ml-2 font-normal">
              {positionDetails?.ref_rxpwr}
            </span>
          </label>
          <label
            className="inline-flex flex-col w-full"
            aria-label="reference fp power"
          >
            <span className="ml-2 font-semibold">ref_fppwr:</span>
            <span className="ml-2 font-normal">
              {positionDetails?.ref_fppwr}
            </span>
          </label>

          <div className="col-span-2">
            <label
              className="inline-flex flex-col w-full"
              aria-label="receivers receiver power"
            >
              <span className="ml-2 font-semibold">receivers_rxpwr:</span>
              <span className="ml-2 font-normal">
                {positionDetails?.receivers_rxpwr}
              </span>
            </label>
          </div>

          <div className="col-span-2">
            <label
              className="inline-flex flex-col w-full"
              aria-label="receivers fp power"
            >
              <span className="ml-2 font-semibold">receivers_fppwr:</span>
              <span className="ml-2 font-normal">
                {positionDetails?.receivers_fppwr}
              </span>
            </label>
          </div>
        </div>
      )}
    </>
  );
}
