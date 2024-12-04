import { useState, useEffect } from "react";

interface TrackedItem {
    [key: string]: any;
}

interface TrackChangesResult {
    trackedItems: TrackedItem[];
    newItems: Array<{ key?: string; value?: any; item?: any; position?: number }>;
    removedItems: Array<{ key?: string; value?: any; item?: any; position?: number }>;
}

export const useTrackChanges = (items: any[], typeOfItem: string): TrackChangesResult => {
    const [trackedItems, setTrackedItems] = useState<TrackedItem[]>([]);
    const [newItems, setNewItems] = useState<TrackChangesResult["newItems"]>([]);
    const [removedItems, setRemovedItems] = useState<TrackChangesResult["removedItems"]>([]);

    useEffect(() => {
        if (!items) return;

        let updatedTrackedItems = [...trackedItems];
        const newEntries: TrackChangesResult["newItems"] = [];
        const removedEntries: TrackChangesResult["removedItems"] = [];

        items.forEach((item, index) => {
            if (typeOfItem === "ARRAY") {
                if (!updatedTrackedItems[index]) {
                    updatedTrackedItems[index] = [...item];
                    newEntries.push(...item.map((_: unknown, i: number) => ({ item: item[i], position: i })));
                } else {
                    item.forEach((entry: string, entryIndex: number) => {
                        if (updatedTrackedItems[index][entryIndex] !== entry) {
                            updatedTrackedItems[index].splice(entryIndex, 0, entry);
                            newEntries.push({ item: entry, position: entryIndex });
                        }
                    });

                    const removedForDelay: number[] = [];
                    updatedTrackedItems[index].forEach((trackedEntry: string, trackedEntryIndex: number) => {
                        const isStillPresent = item.includes(trackedEntry);
                        if (!isStillPresent || trackedEntry !== item[trackedEntryIndex]) {
                            removedEntries.push({ item: trackedEntry, position: trackedEntryIndex });
                            removedForDelay.push(trackedEntryIndex);
                        }
                    });

                    if (removedForDelay.length > 0) {
                        setTimeout(() => {
                            updatedTrackedItems = updatedTrackedItems.map((lst, idx) =>
                                idx === index ? lst.filter((_: unknown, i: number) => !removedForDelay.includes(i)) : lst
                            );
                            setTrackedItems([...updatedTrackedItems]);
                        }, 2000);
                    }
                }
            } else if (typeOfItem === "DICT") {
                if (!updatedTrackedItems[index]) {
                    updatedTrackedItems[index] = { ...item };
                    newEntries.push(...Object.keys(item).map((key) => ({ key, value: item[key] })));
                } else {
                    Object.entries(item).forEach(([key, value]) => {
                        if (!updatedTrackedItems[index][key] || updatedTrackedItems[index][key] !== value) {
                            updatedTrackedItems[index][key] = value;
                            newEntries.push({ key, value });
                        }
                    });

                    Object.keys(updatedTrackedItems[index]).forEach((key) => {
                        if (!(key in item)) {
                            removedEntries.push({ key });
                            setTimeout(() => {
                                updatedTrackedItems = updatedTrackedItems.map((dict, idx) =>
                                    idx === index ? Object.fromEntries(Object.entries(dict).filter(([k]) => k !== key)) : dict
                                );
                                setTrackedItems([...updatedTrackedItems]);
                            }, 2000);
                        }
                    });
                }
            } else if (typeOfItem === "SET") {
                if (!updatedTrackedItems[index]) {
                    updatedTrackedItems[index] = new Set(item);
                    item.forEach((setItem: unknown) => newEntries.push({ item: setItem }));
                } else {
                    const currentSet = updatedTrackedItems[index] as Set<any>;

                    item.forEach((setItem: unknown) => {
                        if (!currentSet.has(setItem)) {
                            currentSet.add(setItem);
                            newEntries.push({ item: setItem });
                        }
                    });

                    const itemsToRemove: any[] = [];
                    currentSet.forEach((setItem) => {
                        if (!item.includes(setItem)) {
                            itemsToRemove.push(setItem);
                            removedEntries.push({ item: setItem });
                        }
                    });

                    setTimeout(() => {
                        itemsToRemove.forEach((setItem) => currentSet.delete(setItem));
                        setTrackedItems([...updatedTrackedItems]);
                    }, 2000);
                }
            } else if (typeOfItem === "TREE") {
                if (!updatedTrackedItems[index]) {
                    updatedTrackedItems[index] = { ...item };
                    newEntries.push(item);
                } else {
                    Object.entries(item).forEach(([key, value]) => {
                        if (updatedTrackedItems[index][key] !== value) {
                            updatedTrackedItems[index][key] = value;
                            newEntries.push({ key, value });
                        }
                    });

                    Object.keys(updatedTrackedItems[index]).forEach((key) => {
                        if (!(key in item)) {
                            removedEntries.push({ key });
                            setTimeout(() => {
                                updatedTrackedItems = updatedTrackedItems.map((node, idx) =>
                                    idx === index ? { ...node, [key]: undefined } : node
                                );
                                setTrackedItems([...updatedTrackedItems]);
                            }, 2000);
                        }
                    });
                }
            }
        });

        setTrackedItems([...updatedTrackedItems]);
        setNewItems(newEntries);
        setRemovedItems(removedEntries);

        const timeout = setTimeout(() => {
            setNewItems([]);
            setRemovedItems([]);
        }, 2000);

        return () => clearTimeout(timeout);
    }, [items, typeOfItem, trackedItems]);

    return { trackedItems, newItems, removedItems };
};
