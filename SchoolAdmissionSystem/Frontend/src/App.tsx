import { Button } from "./components/ui/button";

function App() {
  return (
    <>
      <section className="bg-red-400">
        <Button variant="default" size="default">
          Default Button
        </Button>
      </section>
      <section className="bg-green-400">
        <Button variant="outline" size="sm">
          Outline Button
        </Button>
      </section>
    </>
  );
}

export default App;
