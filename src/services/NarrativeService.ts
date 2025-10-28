import { Story } from "inkjs";

// The type of data our engine will provide to the outside world (React)
export interface IStoryState {
  text: string[];
  choices: { index: number; text: string }[];
  tags: string[]; // All tags from Ink story (image:, music:, sound:, etc.)
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
  private currentState: IStoryState = {
    text: [],
    choices: [],
    tags: [],
    isEnded: false,
  };

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
      // Story loaded successfully. The context will handle initialization.
    } catch (error) {
      console.error("NarrativeService Error:", error);
      // More advanced error handling can be implemented here.
    }
  }

  // Set a callback (listener) to listen for story state changes
  public setOnStateChange(callback: (state: IStoryState) => void) {
    this.onStateChange = callback;
  }

  // Initialize the story after loading (read the initial state without consuming it)
  public initializeStory(): void {
    if (!this.story) return;

    // Read and cache the initial text
    this.refreshState();
  }

  // Continue the story to the next step
  public continueStory(): void {
    if (!this.story) return;

    // Read and cache the next text block
    this.refreshState();
  }

  // Make a choice
  public makeChoice(choiceIndex: number): void {
    if (!this.story?.currentChoices[choiceIndex]) return;

    this.story.ChooseChoiceIndex(choiceIndex);
    // After a choice, the story usually continues automatically
    this.continueStory();
  }

  // Refresh the state: read from story and notify observers
  private refreshState(): void {
    this.updateCurrentState();
    this.notifyStateChange();
  }

  // Update the cached current state by reading from the story
  private updateCurrentState(): void {
    if (!this.story) {
      this.currentState = {
        text: [],
        choices: [],
        tags: [],
        isEnded: false,
      };
      return;
    }

    const currentText: string[] = [];
    const allTags: string[] = [];

    // Collect text and tags together while reading the story
    while (this.story.canContinue) {
      currentText.push(this.story.Continue() || "");
      // Collect tags after each Continue() call
      if (this.story.currentTags && this.story.currentTags.length > 0) {
        allTags.push(...this.story.currentTags);
      }
    }

    const choices = this.story.currentChoices.map((choice) => ({
      index: choice.index,
      text: choice.text,
    }));

    this.currentState = {
      text: currentText,
      choices: choices,
      tags: allTags,
      isEnded:
        !this.story.canContinue && this.story.currentChoices.length === 0,
    };
  } // Private method to notify the outside world of our state
  private notifyStateChange(): void {
    if (this.onStateChange) {
      console.log(this.currentState);
      this.onStateChange(this.currentState);
    }
  }

  // Return the current cached story state (non-destructive read)
  public getCurrentState(): IStoryState {
    return this.currentState;
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
