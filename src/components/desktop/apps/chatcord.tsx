
/*
  ================================================================================
  FILE OVERVIEW: Ink Story Player (Misleadingly named chatcord.tsx)
  ================================================================================

  This file implements a player for interactive fiction stories created with Ink.
  The filename `chatcord.tsx` is a remnant of a previous feature and does not
  reflect the file's current functionality.

  The application consists of two main views:
  1. A `SceneSelector` to choose a story.
  2. A `StoryPlayer` to play the selected interactive story.

  The `ChatCordApp` component manages which view is currently active.
*/
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Story } from 'inkjs/engine/Story';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Scene } from '@/lib/scene-types';
import { sceneManager } from '@/lib/scene-manager';
import { eventManager } from '@/lib/event-manager';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useFlags } from '@/hooks/use-flags';

type HistoryItem = {
  id: string;
  type: 'text' | 'choice' | 'player' | 'tag';
  content: string;
};

type Choice = {
  text: string;
  index: number;
};

/**
 * Renders the main interactive story player UI.
 * It takes a `scene` object, loads the story using `inkjs`, and manages the
 * narrative flow, including displaying story text and handling player choices.
 * @param {object} props - The component props.
 * @param {Scene} props.scene - The story scene object to be played.
 * @param {() => void} props.onBack - Callback function to return to the scene selector.
 */
function StoryPlayer({ scene, onBack }: { scene: Scene; onBack: () => void }) {
  const [story, setStory] = useState<Story | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [choices, setChoices] = useState<Choice[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { setFlag, getFlag, enterScene, exitScene } = useFlags();

  const scrollToBottom = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, []);

  const continueStory = useCallback((currentStory: Story, newHistoryItems: HistoryItem[]) => {
    let currentText = '';
    let currentTags: string[] = [];

    while (currentStory.canContinue) {
      currentText += currentStory.Continue();
      currentTags = currentTags.concat(currentStory.currentTags);
    }
    
    let tempHistory = [...newHistoryItems];
    let idCounter = history.length + tempHistory.length;

    if (currentText.trim()) {
      tempHistory.push({
        id: `text-${idCounter++}`,
        type: 'text',
        content: currentText.trim(),
      });
    }

    currentTags.forEach(tag => {
        tempHistory.push({
            id: `tag-${idCounter++}`,
            type: 'tag',
            content: tag.trim(),
        });
    });

    setHistory(prev => [...prev, ...tempHistory]);
    setChoices(currentStory.currentChoices.map(choice => ({ text: choice.text, index: choice.index })));
  }, [history.length]);


  useEffect(() => {
    if (scene && scene.storyContent && setFlag && getFlag && enterScene && exitScene) {
        const newStory = new Story(scene.storyContent);

        newStory.BindExternalFunction("setFlag", (key: string, value: any) => {
            setFlag(key, value);
        });

        newStory.BindExternalFunction("getFlag", (key: string) => {
            return getFlag(key);
        });
        
        enterScene(scene.id);
        
        setStory(newStory);
        setHistory([]);
        setChoices([]);
        continueStory(newStory, []);

        return () => {
            exitScene(scene.id);
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);
  
  useEffect(() => {
    scrollToBottom();
  }, [history, scrollToBottom]);

  const handleChoice = (choiceIndex: number) => {
    if (!story) return;

    const choiceText = story.currentChoices.find(c => c.index === choiceIndex)?.text || '';
    const playerHistoryItem: HistoryItem = {
        id: `player-${history.length}`,
        type: 'player',
        content: choiceText,
    };
    
    story.ChooseChoiceIndex(choiceIndex);
    continueStory(story, [playerHistoryItem]);
  };

  return (
    <div className="h-full w-full flex flex-col bg-background">
      <header className="flex items-center p-4 border-b">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Avatar className="h-10 w-10">
          <AvatarImage src={scene.avatar.imageUrl} />
          <AvatarFallback>{scene.avatar.fallback}</AvatarFallback>
        </Avatar>
        <div className="ml-4">
          <h2 className="font-semibold">{scene.title}</h2>
          <p className="text-sm text-muted-foreground">Playing</p>
        </div>
      </header>

      <div ref={scrollContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {history.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {item.type === 'text' && (
                 <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={scene.avatar.imageUrl} />
                        <AvatarFallback>{scene.avatar.fallback}</AvatarFallback>
                    </Avatar>
                    <p className="bg-muted rounded-lg p-3 text-sm max-w-[75%]">{item.content}</p>
                </div>
              )}
              {item.type === 'tag' && (
                <p className="text-center text-xs text-muted-foreground italic py-2">{item.content}</p>
              )}
              {item.type === 'player' && (
                <div className="flex items-start justify-end gap-3">
                    <p className="bg-primary text-primary-foreground rounded-lg p-3 text-sm max-w-[75%]">{item.content}</p>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {choices.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20}}
              transition={{ duration: 0.2 }}
              className="border-t p-4"
            >
              <div className="grid grid-cols-1 gap-2">
                {choices.map((choice) => (
                  <Button
                    key={choice.index}
                    variant="outline"
                    className="w-full justify-start p-4 h-auto"
                    onClick={() => handleChoice(choice.index)}
                  >
                    {choice.text}
                  </Button>
                ))}
              </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Renders the initial scene selection screen.
 * It displays a list of all available stories from `src/lib/story/scenes.ts`.
 * @param {object} props - The component props.
 * @param {(scene: Scene) => void} props.onSelectScene - Callback function that gets triggered
 *   when a user selects a scene, passing the selected scene object.
 */
function SceneSelector({ onSelectScene, scenes }: { onSelectScene: (scene: Scene) => void, scenes: Scene[] }) {
    return (
      <div className="h-full w-full flex flex-col">
        <header className="p-4 border-b">
          <h1 className="text-2xl font-bold">ChatCored</h1>
        </header>
        <div className="flex-grow overflow-y-auto">
          {scenes.map((scene) => (
            <button
              key={scene.id}
              onClick={() => onSelectScene(scene)}
              className="flex items-center w-full text-left p-4 gap-4 hover:bg-muted transition-colors"
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={scene.avatar.imageUrl} />
                <AvatarFallback>{scene.avatar.fallback}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <h2 className="font-semibold">{scene.title}</h2>
                <p className="text-sm text-muted-foreground truncate">{scene.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
}

/**
 * The main component for the story player application.
 * It manages the application's state, switching between the `SceneSelector` view
 * and the `StoryPlayer` view based on whether a scene has been selected.
 */
export default function ChatCordApp() {
  const [activeScene, setActiveScene] = useState<Scene | null>(null);
  const [availableScenes, setAvailableScenes] = useState<Scene[]>([]);

  useEffect(() => {
    const handleAvailableScenesChanged = (scenes: Scene[]) => {
      setAvailableScenes(scenes);
    };

    const handleForceScene = (scene: Scene) => {
        setActiveScene(scene);
    };

    setAvailableScenes(sceneManager.getAvailableScenes());

    const unsubscribeScenesChanged = eventManager.on('availableScenesChanged', handleAvailableScenesChanged);
    const unsubscribeForceScene = eventManager.on('forceScene', handleForceScene);

    return () => {
      unsubscribeScenesChanged();
      unsubscribeForceScene();
    };
  }, []);

  if (activeScene) {
    return <StoryPlayer scene={activeScene} onBack={() => setActiveScene(null)} />;
  }

  return <SceneSelector onSelectScene={setActiveScene} scenes={availableScenes} />;
}
