import React from "react";
import { useTrackChanges } from "../useTrackState";
import "./SetVisualizer.css";

interface SetVisualizerProps {
    set: any[][];
}

const SetVisualizer: React.FC<SetVisualizerProps> = ({ set }) => {
    // const {
    //     trackedItems: trackedSets,
    //     newItems,
    //     removedItems,
    // } = useTrackChanges(set, "SET");

    return (
        <div className="set-visualizer">
            {/* <h3>Set Visualizer</h3>
            {trackedSets.map((trackedSet, setIndex) => (
                <div key={setIndex} className="set-container">
                    <h4>Set {setIndex + 1}</h4>
                    <div className="set-grid">
                        {[...trackedSet].map((item, index) => (
                            <div
                                key={index}
                                className={`set-item ${newItems.some((newItem) => newItem.item === item)
                                    ? "animate-new"
                                    : removedItems.some((removedItem) => removedItem.item === item)
                                        ? "animate-remove"
                                        : ""
                                    }`}
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            ))} */}
        </div>
    );
};

export default SetVisualizer;
