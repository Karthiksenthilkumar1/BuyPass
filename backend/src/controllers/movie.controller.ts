import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getAllMovies = async (req: Request, res: Response) => {
  try {
    const { genre, language, search } = req.query;

    const movies = await prisma.movie.findMany({
      where: {
        AND: [
          genre ? { genre: String(genre) } : {},
          language ? { language: String(language) } : {},
          search ? { title: { contains: String(search), mode: "insensitive" } } : {},
        ],
      },
      orderBy: { releaseDate: "desc" },
    });

    res.json(movies);
  } catch (error) {
    console.error("Get movies error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMovieById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const movie = await prisma.movie.findUnique({
      where: { id },
      include: { shows: true },
    });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(movie);
  } catch (error) {
    console.error("Get movie by ID error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createMovie = async (req: Request, res: Response) => {
  try {
    const { title, description, language, genre, durationMinutes, releaseDate, posterUrl, trailerUrl } = req.body;

    if (!title || !description || !language || !genre || !durationMinutes || !releaseDate || !posterUrl) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const movie = await prisma.movie.create({
      data: {
        title,
        description,
        language,
        genre,
        durationMinutes: parseInt(durationMinutes),
        releaseDate: new Date(releaseDate),
        posterUrl,
        trailerUrl,
      },
    });

    res.status(201).json({ message: "Movie created successfully", movie });
  } catch (error) {
    console.error("Create movie error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateMovie = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (data.durationMinutes) data.durationMinutes = parseInt(data.durationMinutes);
    if (data.releaseDate) data.releaseDate = new Date(data.releaseDate);

    const movie = await prisma.movie.update({
      where: { id },
      data,
    });

    res.json({ message: "Movie updated successfully", movie });
  } catch (error) {
    console.error("Update movie error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteMovie = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.movie.delete({
      where: { id },
    });

    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    console.error("Delete movie error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
