"use client"

import React, { useState } from "react";

const Referral = (props) => {
    const [copyText, setCopyText] = useState("Copy");

    const referralLink = `https://pos.profitiqai.tech?ref=${props.address ? props.address : ""}`; // change during production

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
        setCopyText("Copied");
        setTimeout(() => {
            setCopyText("Copy");
        }, 2000);
    };

    return (
        <div className="bg-white h-full rounded-[10px] shadow-lg overflow-hidden p-4 mt-3">
            <div>
                {!props.referred && (
                    <div>
                        <h2 className="my-2">Referral Address</h2>
                        <input
                            type="text"
                            id="referral"
                            name="referral"
                            className="outline-none mb-4 placeholder-slate-600 placeholder-custom w-full p-3 placeholder-text-right border border-slate-200"
                            placeholder="Enter referral address"
                            value={props.referrer}
                            onChange={(e) => props.setReferrer(e.target.value)}
                        />

                        <br />
                    </div>
                )}

                {/* <h2 className="my-2">Referred by?</h2>
        <p className="bg-slate-200 p-3 rounded-md text-sm text-slate-600">
          0x0003D3WJ394059K9J48689JI947 */}
                {/* </p> */}
                <h2 className="my-2">Referral Link</h2>
                <p className="bg-slate-200 p-3 py-3 rounded-md text-sm text-yellow-500 flex items-center justify-between gap-3">
                    <span className="break-words overflow-clip">{referralLink.slice(0, 36) + "...."}</span>
                    <button
                        className="p-3 h-full text-slate-600 hover:bg-slate-300 rounded"
                        onClick={handleCopyToClipboard}
                    >
                        {copyText}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Referral;
