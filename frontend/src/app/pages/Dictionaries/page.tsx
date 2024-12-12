"use client";
import Header from "../../components/Header/Header";
import CodeVisualizer from "../../CodeVisualizer/CodeVisualizer";
export default function Dictionaries() {

    return (
        <div>
            <Header />
            <CodeVisualizer
                defaultCode={`dictionary = {'apple': 'red', 'banana': 'yellow', 'orange': 'orange'}
dictionary['kiwi'] = 'green'
del dictionary['banana']
`}
                height="500px"
                onTraceComplete={(trace) => console.log('Trace completed', trace)}
            />

        </div>
    );
}