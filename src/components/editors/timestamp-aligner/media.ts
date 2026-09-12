export async function safePlay(media: HTMLMediaElement | null) {
  if (!media) return;
  try {
    await media.play();
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return;
  }
}

export function safePause(media: HTMLMediaElement | null) {
  if (!media || media.paused) return;
  media.pause();
}
