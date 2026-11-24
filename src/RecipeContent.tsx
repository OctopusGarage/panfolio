import Markdown from "react-markdown";
import { recipeSections } from "./recipe-content";
export function RecipeContent({ body }: { body: string }) {
  const sections = recipeSections(body);
  return (
    <div className="recipe-columns">
      {sections.map((section) => (
        <section
          key={section.title}
          className={
            section.title === "食材"
              ? "ingredients-panel"
              : section.title === "做法"
                ? "method-panel"
                : "recipe-extra"
          }
        >
          <h3 className="section-title">{section.title}</h3>
          <Markdown components={{ h3: ({ children }) => <h4>{children}</h4> }}>
            {section.content}
          </Markdown>
        </section>
      ))}
    </div>
  );
}
