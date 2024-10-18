import Header from "./components/Header/Header";
import Card from "./components/Card/Card";


export default function Home() {
  return (

    <div >

      <Header />
      <div
        className="text-container"
      >
        Visualize Your Code Like Never Before
        <div className="subtext">
          Transform your code into powerful visualizations for better understanding and debugging.
        </div>
      </div>
      <div className="card-container__title">
        Practice Data Structures
      </div>
      <div className="card-container">
        <Card label="Arrays" />
        <Card label="LinkedList" />
        <Card label="Stacks" />
        <Card label="Queues" />
        <Card label="Binary Search Trees" />
        <Card label="Dictionaries" />
      </div>
    </div>
  );
}
