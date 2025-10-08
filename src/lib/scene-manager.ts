

import { eventManager } from './event-manager';
import { Scene, SceneDefinition } from './scene-types';
import { scenes as allScenes } from './story/scenes';

class SceneManager {
  private allScenes: { [id: string]: SceneDefinition } = allScenes;
  private availableScenes: string[] = ['new_user_introduction']; // Start with the intro scene
  private sceneCache: { [key: string]: any } = {};

  constructor() {
    this.preloadInitialScenes();
  }

  private async preloadInitialScenes() {
    for (const sceneId of this.availableScenes) {
      await this.loadSceneContent(sceneId);
    }
    eventManager.emit('availableScenesChanged', this.getAvailableScenes());
  }

  private async loadSceneContent(sceneId: string) {
    if (this.sceneCache[sceneId] || !this.allScenes[sceneId]) {
      return;
    }

    try {
      const sceneModule = await import(`@/lib/story/${sceneId}.ink.json`);
      this.sceneCache[sceneId] = sceneModule.default;
    } catch (error) {
      console.error(`[SceneManager] Failed to load story content for scene: ${sceneId}`, error);
    }
  }

  public getAvailableScenes(): Scene[] {
    const uniqueSceneIds = [...new Set(this.availableScenes)];
    return uniqueSceneIds
      .map(id => {
        const sceneData = this.allScenes[id];
        if (sceneData && this.sceneCache[id]) {
          return {
            ...sceneData,
            storyContent: this.sceneCache[id],
          };
        }
        return null;
      })
      .filter((scene): scene is Scene => scene !== null);
  }

  public async makeSceneAvailable(sceneId: string) {
    if (!this.allScenes[sceneId]) {
      console.warn(`[SceneManager] Attempted to make unknown scene available: ${sceneId}`);
      return;
    }

    if (!this.availableScenes.includes(sceneId)) {
      await this.loadSceneContent(sceneId);
      this.availableScenes.push(sceneId);
      eventManager.emit('availableScenesChanged', this.getAvailableScenes());
      console.log(`[SceneManager] Scene made available: ${sceneId}`);
    }
  }

  public async forceScene(sceneId: string) {
    if (!this.allScenes[sceneId]) {
      console.warn(`[SceneManager] Attempted to force unknown scene: ${sceneId}`);
      return;
    }

    if (!this.availableScenes.includes(sceneId)) {
      await this.makeSceneAvailable(sceneId);
    }

    const scene = this.getAvailableScenes().find(s => s.id === sceneId);
    if (scene) {
      eventManager.emit('forceScene', scene);
      console.log(`[SceneManager] Forcing scene: ${sceneId}`);
    } else {
        console.error(`[SceneManager] Could not force scene, as it was not found after being made available: ${sceneId}`);
    }
  }
}

export const sceneManager = new SceneManager();
