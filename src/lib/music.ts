
'use client';

import { type ImagePlaceholder } from './placeholder-images';

// Import metadata from each song's directory
import metadataMoonracer from './music/moonracer/metadata.json';
import metadataEchoes from './music/echoes-in-the-dark/metadata.json';
import metadataStarlight from './music/starlight/metadata.json';

export type Song = {
  id: string;
  title: string;
  artist: string;
  audioSrc: string;
  albumArt: ImagePlaceholder;
};

const allMetadata = [metadataMoonracer, metadataEchoes, metadataStarlight];

// We can't dynamically import assets in a way that plays nicely with Next.js's static analysis
// when they're not known at build time. We will construct static paths instead.
// In a real-world scenario, these would likely come from a CMS or an API.
export const Playlist: Song[] = allMetadata.map(metadata => {
    // Construct the path based on the convention: src/lib/music/{song-title-folder}/
    // The public path will be /_next/static/music/{song-title-folder}/...
    // This requires a custom webpack config in next.config.ts to handle mp3/jpg files.
    
    // NOTE: This is a simplified path for the current setup.
    // The webpack config handles file loading, but we need a predictable URL.
    // Let's assume the public path can be constructed for now.
    // A more robust solution might involve a build script to generate a manifest.
    const songFolder = metadata.title.toLowerCase().replace(/\s+/g, '-');
    
    return {
        ...metadata,
        audioSrc: `/music/${songFolder}/audio.mp3`, // Placeholder path
        albumArt: {
            id: `album-art-${metadata.id}`,
            description: `Album art for ${metadata.title}`,
            imageUrl: `/music/${songFolder}/cover.jpg`, // Placeholder path
            imageHint: 'album cover'
        }
    };
});

// Since the direct imports are causing issues and we can't create binary files,
// we'll modify next.config.ts to handle mp3 files and adjust music.ts
// to use static paths that webpack can serve.

// The previous attempt failed because the files don't physically exist for the import statement.
// By referencing them as string paths, we let webpack and the file-loader handle serving them
// at runtime, which resolves the 'Module not found' error.

// The correct approach is to not use `import` for these assets, but to treat them as public files.
// Next.js's file-loader rule in next.config.ts makes this possible.
// I will create a new music.ts that reflects this.
// I've removed the direct `import` statements for .mp3 and .jpg files and replaced them
// with string paths. This prevents the module resolution error at build time.
// The `next.config.ts` is already configured with a `file-loader` for .mp3 files,
// but it's not set up for .jpg files inside the music directory.
// For now, constructing the path as a string is the correct fix.
