"use client";
import Header from "../../components/Header/Header";
import CodeVisualizer from "../../CodeVisualizer/CodeVisualizer";
export default function Stacks() {

    return (
        <div>
            <Header />
            <CodeVisualizer
                defaultCode={`stack = [1, 2, 3, 4]
stack.append(5)
stack.pop()
`}
                height="500px"
                onTraceComplete={(trace) => console.log('Trace completed', trace)}
            />

        </div>

    );
}