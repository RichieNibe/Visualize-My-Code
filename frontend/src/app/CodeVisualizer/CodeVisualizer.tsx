"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import ListVisualizer from "../DataStructures/ListVisualizer";
import SetVisualizer from "../DataStructures/SetVisualizer";
import DictVisualizer from "../DataStructures/DictionaryVisualizer";
// import TreeVisualizer from "./TreesVisualizer";
import "./CodeVisualizer.css";

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

const CodeVisualizer: React.FC = () => {
    const [code, setCode] = useState<string>("");
    const [trace, setTrace] = useState<TraceStep[] | null>(null);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleCodeChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setCode(event.target.value);
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setCurrentStep(0);
        setError(null);
        setTrace(null);

        try {
            const response = await axios.post("http://127.0.0.1:8000/run_code", { code });
            setTrace(response.data.trace);
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

    const handleStepChange = (event: ChangeEvent<HTMLInputElement>) => {
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
                <h1>Python Code Visualizer</h1>
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={code}
                        onChange={handleCodeChange}
                        placeholder="Type your Python code here..."
                        rows={10}
                        cols={50}
                        disabled={loading}
                    />
                    <br />
                    <button type="submit" disabled={loading}>
                        {loading ? "Executing..." : "Visualize Execution"}
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
                            {currentStep < trace.length - 1 ? "Next Step" : "No More Steps"}
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
