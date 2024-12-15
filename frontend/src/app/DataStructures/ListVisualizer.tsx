import React, { useEffect, useState } from "react";
import { useTrackChanges } from "../useTrackState";
import "./ListVisualizer.css";

interface ListVisualizerProps {
    list: any[][];
}

const ListVisualizer: React.FC<ListVisualizerProps> = ({ list }) => {
    const { trackedItems: trackedLists, newItems, removedItems } = useTrackChanges(list, "ARRAY");

    const [currentPointer, setCurrentPointer] = useState<number | null>(null);

    useEffect(() => {
        let pointerInterval: NodeJS.Timeout | null = null; // ✅ Explicit type

        if (trackedLists.length > 0) {
            let pointerIndex = 0;
            pointerInterval = setInterval(() => {
                setCurrentPointer(pointerIndex);
                pointerIndex++;
                if (pointerIndex >= trackedLists[0].length) {
                    clearInterval(pointerInterval!); // ✅ Non-null assertion
                    setCurrentPointer(null); // Remove pointer after finishing loop
                }
            }, 500); // Pointer speed (500ms delay)
        }

        return () => {
            if (pointerInterval) clearInterval(pointerInterval);
        };
    }, [trackedLists]);

    return (
        <div className="list-visualizer">
            <h3>List Visualizer</h3>
            {trackedLists.map((sublist, sublistIndex) => (
                <div key={sublistIndex} className="list-container">
                    <h4>List {sublistIndex + 1}</h4>
                    <div className="list-grid stack-container">
                        {sublist.slice().reverse().map((item: string, index: number) => {
                            const originalIndex = sublist.length - 1 - index;
                            const isNewItem = newItems.some(
                                (newItem) => newItem.item === item && newItem.position === originalIndex
                            );
                            const isRemovedItem = removedItems.some(
                                (removedItem) => removedItem.item === item && removedItem.position === originalIndex
                            );
                            const isPointerHere = currentPointer === originalIndex;

                            return (
                                <div
                                    key={index}
                                    className={`list-item 
                                        ${isNewItem ? "animate-new" : ""} 
                                        ${isRemovedItem ? "animate-remove" : ""} 
                                        ${isPointerHere ? "pointer" : ""} 
                                        reverse-animate`}
                                >
                                    {item}
                                    {isPointerHere && <div className="pointer-indicator">🔹</div>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ListVisualizer;
