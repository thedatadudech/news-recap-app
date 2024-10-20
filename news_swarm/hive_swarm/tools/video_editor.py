import sys
import os
from moviepy.editor import (
    VideoFileClip,
    ImageClip,
    AudioFileClip,
    TextClip,
    concatenate_videoclips,
    CompositeVideoClip,
    vfx,
)


# Function for Slide Transition
def apply_slide(clip, duration=1, direction="left"):
    # Calculate the offset for the slide based on direction
    if direction == "left":
        offset = (-clip.w, 0)
    elif direction == "right":
        offset = (clip.w, 0)
    elif direction == "up":
        offset = (0, -clip.h)
    elif direction == "down":
        offset = (0, clip.h)
    else:
        raise ValueError(
            "Invalid direction. Choose from 'left', 'right', 'up', 'down'."
        )

    # Create a composite clip with the slide effect
    slide_clip = CompositeVideoClip(
        [
            clip.set_position(
                lambda t: (
                    offset[0] * (1 - t / duration),
                    offset[1] * (1 - t / duration),
                )
            )
        ],
        size=clip.size,
    ).set_duration(duration)

    # Concatenate the slide effect with the original clip
    return concatenate_videoclips([slide_clip, clip.set_start(duration)])


# Function for Zoom Transition
def apply_zoom(clip, zoom_factor=1.2, duration=1):
    return (
        clip.fx(vfx.resize, zoom_factor)
        .set_duration(duration)
        .crossfadein(duration)
        .crossfadeout(duration)
    )


def video_editor(
    video_files: list[str],
    output_filename: str,
    image_files: list[str] = None,
    text_clips: list[str] = None,
    transition_type=None,
    video_format="normal",
    transition_duration=1,
    audio_file: str = None,  # New parameter for audio file
):
    """
    This function takes a list of video files, images, and text clips, resizes and crops them to fit YouTube dimensions, and concatenates them into a single news recap video file. Optionally, it adds an audio track.

    :param video_files: A list of paths to video files.
    :param image_files: A list of paths to image files.
    :param text_clips: A list of text strings (news summaries) to display as text clips.
    :param output_filename: The path to the output video file.
    :param transition_type: Type of transition between clips (fade, slide, zoom).
    :param video_format: The format of the video (e.g., 'youtube' for YouTube Shorts).
    :param transition_duration: Duration of the transition in seconds.
    :param audio_file: Path to an audio file to be added to the video.
    :return: The path to the output video file.
    """

    clips = []

    # Process video files
    for video in video_files:
        try:
            clip = VideoFileClip(video)
            clip_cropped = resize_and_crop(clip, video_format)
            clips.append(
                apply_transition(clip_cropped, transition_type, transition_duration)
            )
        except Exception as e:
            print(f"Error processing video {video}: {e}")

    # Process image files
    if image_files:
        for image in image_files:
            try:
                img_clip = ImageClip(image, duration=5)  # Each image lasts 5 seconds
                img_cropped = resize_and_crop(img_clip, video_format)
                clips.append(
                    apply_transition(img_cropped, transition_type, transition_duration)
                )
            except Exception as e:
                print(f"Error processing image {image}: {e}")

    # Process text clips
    if text_clips:
        for text in text_clips:
            try:
                text_clip = TextClip(
                    text,
                    fontsize=60,
                    color="white",
                    size=(1080, 1920),
                    method="caption",
                    bg_color="black",
                    align="center",
                ).set_duration(5)
                clips.append(text_clip)
            except Exception as e:
                print(f"Error processing text: {e}")

    if not clips:
        print("No valid clips were processed.")
        sys.exit(1)

    # Concatenate clips
    final_clip = concatenate_videoclips(clips, method="compose")

    # Add audio if provided
    if audio_file:
        try:
            audio = AudioFileClip(audio_file)
            final_clip = final_clip.set_audio(audio)
        except Exception as e:
            print(f"Error processing audio file {audio_file}: {e}")

    # Write the final video file
    final_clip.write_videofile(
        output_filename,
        fps=30,
        codec="libx264",
        audio_codec="aac",
        preset="medium",
        threads=4,
    )

    return os.path.abspath(output_filename)


def resize_and_crop(clip, video_format="normal"):
    """
    Resizes and crops a clip to target dimensions (e.g., for YouTube Shorts).
    """
    # Set target dimensions for YouTube Shorts
    target_width = 1080
    target_height = 1920

    # Determine the scaling factor to cover the target dimensions
    clip_width, clip_height = clip.size
    width_ratio = target_width / clip_width
    height_ratio = target_height / clip_height
    scaling_factor = max(width_ratio, height_ratio)

    # Resize the clip to cover the target area
    clip_resized = clip.resize(height=int(clip.h * scaling_factor))

    # Center crop the clip to target dimensions
    if video_format == "youtube":
        return clip_resized.crop(
            x_center=clip_resized.w / 2,
            y_center=clip_resized.h / 2,
            width=target_width,
            height=target_height,
        )
    else:
        return clip_resized


def apply_transition(clip, transition_type=None, transition_duration=1):
    """
    Applies a transition (fade, slide, zoom) to the clip based on the transition type.
    """
    if transition_type == "fade":
        return clip.crossfadeout(transition_duration)
    elif transition_type == "slide":
        return apply_slide(clip, duration=transition_duration, direction="left")
    elif transition_type == "zoom":
        return apply_zoom(clip, zoom_factor=1.2, duration=transition_duration)
    else:
        return clip  # No transition if type is not recognized
