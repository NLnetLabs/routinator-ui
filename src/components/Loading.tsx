import { useEffect, useState } from "react";
import useStatus from "../hooks/useStatus";
import { RoutinatorStatus } from "../types";
import { API_ENDPOINT } from "../core/contants";

interface LoadingProps {
    status: RoutinatorStatus | null;
}

export default function Loading({ status }: LoadingProps) {    
    useEffect(() => {
        if (status && status.error) {
            const checkStatus = () => {
                setTimeout(() => {      
                    fetch(`${API_ENDPOINT}/api/v1/status`)
                        .then((r) => r.json())
                        .then((status) => {
                            if (status && !status.error) {
                                window.location.reload();
                            } else {
                                checkStatus();
                            }
                        }).catch(() => checkStatus());  
                }, 3000)
            };
            checkStatus();
        }
    }, []);

    return (
        <div id="loading">
            <div>
            <img src='/src/img/routinator_logo_white.svg' alt='Routinator logo' />
            <br />
            <p>{status?.error || "Something went wrong"}</p>
            </div>
        </div>
    );
}
