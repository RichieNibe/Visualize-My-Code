// @refresh reset
"use client";

import React, { useState, FormEvent } from "react";
import axios from "axios";
import dynamic from 'next/dynamic';
import { python } from '@codemirror/lang-python';
import ListVisualizer from "../DataStructures/ListVisualizer";
import SetVisualizer from "../DataStructures/SetVisualizer";
import DictVisualizer from "../DataStructures/DictionaryVisualizer";
// import TreeVisualizer from "./TreesVisualizer";
import "./CodeVisualizer.css";

const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), { ssr: false });

interface TraceStep {
    heap: Record<string, any>;
    [key: string]: any;
}

interface HeapObjects {
    listObjects: any[];
    setObjects: any[];
    dictObjects: Record<string, any>[];
    treeObjects: any[];
}

interface CodeVisualizerProps {
    defaultCode?: string; // Default code to initialize the editor
    height?: string; // Height of the CodeMirror editor
    onTraceComplete?: (trace: TraceStep[]) => void; // Callback after trace is complete
}

const CodeVisualizer: React.FC<CodeVisualizerProps> = ({
    defaultCode = "print('Hello, World!')", // Default code as prop
    height = "400px", // Default height
    onTraceComplete = () => { } // Default callback (no-op)
}) => {
    const [code, setCode] = useState<string>(defaultCode); // Use defaultCode prop as initial value
    const [trace, setTrace] = useState<TraceStep[] | null>(null);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleCodeChange = (value: string) => {
        setCode(value);
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setCurrentStep(0);
        setError(null);
        setTrace(null);

        try {
            const response = await axios.post("https://backend-visualize-my-code.onrender.com/run_code", { code });
            setTrace(response.data.trace);
            if (onTraceComplete) {
                onTraceComplete(response.data.trace); // Call the onTraceComplete callback
            }
        } catch (err) {
            setError("An error occurred during code execution.");
            console.error("Error submitting code:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleNextStep = () => {
        if (trace) {
            setCurrentStep((prevStep) => Math.min(prevStep + 1, trace.length - 1));
        }
    };

    const handleStepChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentStep(Number(event.target.value));
    };

    const extractHeapObjects = (heap: Record<string, any>): HeapObjects => {
        const listObjects: any[] = [];
        const setObjects: any[] = [];
        const dictObjects: Record<string, any>[] = [];
        const treeObjects: any[] = [];

        Object.entries(heap).forEach(([objId, obj]) => {
            if (obj[0] === "LIST") {
                listObjects.push(obj.slice(1).flat());
            } else if (obj[0] === "SET") {
                setObjects.push(obj.slice(1).flat());
            } else if (obj[0] === "DICT") {
                const dictEntries: Record<string, any> = {};
                obj.slice(1).forEach(([key, value]: [string, any]) => {
                    dictEntries[key] = value;
                });
                dictObjects.push(dictEntries);
            } else if (obj[0] === "INSTANCE" && obj[1] === "Node") {
                const attributes = obj.slice(2);
                const node: Record<string, any> = { ref: objId };
                attributes.forEach(([key, value]: [string, any]) => {
                    node[key] = value;
                });
                treeObjects.push({ TreeNode: node });
            }
        });

        return { listObjects, setObjects, dictObjects, treeObjects };
    };

    return (
        <div className="container">
            <div className="code-editor">
                <h1>Code Visualizer</h1>
                <form onSubmit={handleSubmit}>
                    <CodeMirror
                        value={code}
                        height={height}
                        extensions={[python()]}
                        onChange={handleCodeChange}
                        theme="light"
                    />
                    <br />
                    <button type="submit" disabled={loading}>
                        {loading ? "Executing..." : <button className="button" >Visualize</button>}
                    </button>
                </form>

                {error && <div style={{ color: "red" }}>{error}</div>}

                {trace && (
                    <div>
                        <h2>
                            Execution Trace (Step {currentStep + 1} of {trace.length}):
                        </h2>
                        <input
                            type="range"
                            min="0"
                            max={trace.length - 1}
                            value={currentStep}
                            onChange={handleStepChange}
                        />
                        <p>Current Step: {currentStep + 1}</p>
                        <button
                            onClick={handleNextStep}
                            disabled={currentStep >= trace.length - 1}
                        >
                            {currentStep < trace.length - 1 ? <button className="button" >Next Step</button> : "No More Steps"}
                        </button>
                    </div>
                )}
            </div>

            <div className="visualizers">
                <h2>Data Structures</h2>
                {trace && trace[currentStep]?.heap && (() => {
                    const { listObjects, setObjects, dictObjects, treeObjects } = extractHeapObjects(trace[currentStep].heap);
                    return (
                        <div>
                            {listObjects.length > 0 && <ListVisualizer list={listObjects} />}
                            {setObjects.length > 0 && <SetVisualizer set={setObjects} />}
                            {dictObjects.length > 0 && <DictVisualizer dictObjects={dictObjects} />}
                            {/* {treeObjects.length > 0 && <TreeVisualizer trees={treeObjects} />} */}
                        </div>
                    );
                })()}
            </div>
        </div>
    );
};

export default CodeVisualizer;
