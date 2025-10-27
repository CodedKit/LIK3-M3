import { Story } from "inkjs";

// The type of data our engine will provide to the outside world (React)
export interface IStoryState {
  text: string[];
  choices: { index: number; text: string }[];
  tags: string[];
  isEnded: boolean;
}

/**
 * NarrativeService (Story Engine)
 * * This class is responsible for managing the state of the Ink story.
 * It has no dependency on the UI (React). It only handles the story logic.
 * This adheres to the Single Responsibility Principle (SRP).
 */
export class NarrativeService {
  private story: Story | null = null;
  private onStateChange: ((state: IStoryState) => void) | null = null;

  // Load the story
  public async loadStory(storyJsonPath: string): Promise<void> {
    try {
      // Fetch the story JSON from the public folder
      const response = await fetch(storyJsonPath);
      if (!response.ok) {
        throw new Error(`Failed to load story file: ${storyJsonPath}`);
      }
      const storyContent = await response.text();

      this.story = new Story(storyContent);
      this.notifyStateChange();
    } catch (error) {
      console.error("NarrativeService Error:", error);
      // More advanced error handling can be implemented here.
    }
  }

  // Set a callback (listener) to listen for story state changes
  public setOnStateChange(callback: (state: IStoryState) => void) {
    this.onStateChange = callback;
  }

  // Continue the story to the next step
  public continueStory(): void {
    if (!this.story) return;

    if (this.story.canContinue) {
      this.story.Continue();
      this.notifyStateChange();
    } else if (this.story.currentChoices.length === 0) {
      // If the story cannot continue and there are no choices, it has ended
      this.notifyStateChange(); // Send the final state (isEnded will be true)
    }
  }

  // Make a choice
  public makeChoice(choiceIndex: number): void {
    if (!this.story?.currentChoices[choiceIndex]) return;

    this.story.ChooseChoiceIndex(choiceIndex);
    // After a choice, the story usually continues automatically
    this.continueStory();
  }

  // Private method to notify the outside world of our state
  private notifyStateChange(): void {
    if (this.onStateChange) {
      this.onStateChange(this.getCurrentState());
    }
  }

  // Compile and return the current story state
  public getCurrentState(): IStoryState {
    if (!this.story) {
      return { text: [], choices: [], tags: [], isEnded: false };
    }

    const currentText: string[] = [];
    while (this.story.canContinue) {
      currentText.push(this.story.Continue() || "");
    }

    const choices = this.story.currentChoices.map((choice) => ({
      index: choice.index,
      text: choice.text,
    }));

    const tags = this.story.currentTags || [];

    return {
      text: currentText,
      choices: choices,
      tags: tags,
      isEnded:
        !this.story.canContinue && this.story.currentChoices.length === 0,
    };
  }

  // (Advanced) For Save/Load
  public getSaveState(): string | null {
    return this.story ? this.story.state.ToJson() : null;
  }

  public loadSaveState(jsonState: string): void {
    if (this.story) {
      this.story.state.LoadJson(jsonState);
      this.notifyStateChange();
    }
  }
}
