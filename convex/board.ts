import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

const placeholderImages = [
    "/placeholders/1.svg",
    "/placeholders/2.svg",
    "/placeholders/3.svg",
    "/placeholders/4.svg",
    "/placeholders/5.svg",
    "/placeholders/6.svg",
    "/placeholders/7.svg",
    "/placeholders/8.svg",
    "/placeholders/9.svg",
    "/placeholders/10.svg"
];

export const create = mutation({
    args: {
        orgId:v.string(),
        title:v.string(),
    },
    handler: async(ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity)
        {
            throw new Error("Unauthenticated");
        }

        const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];

        const board = await ctx.db.insert("boards", {
            title: args.title,
            orgId: args.orgId,
            authorId: identity.subject,
            authorName: identity.name!,
            imageUrl: randomImage, 
        });

        return board;
    }
});

export const deleteBoard = mutation({
    args: {
        boardId: v.id("boards"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity)
        {
            throw new Error("Unauthenticated");
        }

        const board = await ctx.db.get(args.boardId);

        if (board?.authorId! !== identity.subject)
        {
            throw new Error("Unauthorized");
        }

        const existingFavourite = await ctx.db.query("userFavourites").withIndex("by_user_board", (q) => q.eq("userId", identity.subject).eq("boardId", args.boardId)).unique();

        if (existingFavourite)
        {
            await ctx.db.delete(existingFavourite._id);
        }

        await ctx.db.delete(args.boardId);
    },
});

export const updateBoard = mutation({
    args: {
        id: v.id('boards'),
        title: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity)
        {
            throw new Error("Unauthenticated");
        }

        const title = args.title.trim();

        if (title.length > 60)
        {
            throw new Error("Title length cannot be longer than 60 characters.");
        }

        let board: any = await ctx.db.get(args.id);

        if (!board || board.authorId !== identity.subject)
        {
            throw new Error("Board does not exist or unauthorized to make changes.");
        }

        board = await ctx.db.patch(args.id, {
            title: args.title,
        });

        return board;
    }
});

export const favourite = mutation({
    args: {
        id: v.id("boards"), orgId: v.string() 
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity)
        {
            throw new Error("Unauthenticated");
        }

        const board = await ctx.db.get(args.id);

        if (!board)
        {
            throw new Error("Board not found.");
        }

        const userId = identity.subject;

        const existingFavourite = await ctx.db.query("userFavourites").withIndex("by_user_board_org", (q) => q.eq("userId", userId).eq("boardId", board._id).eq("orgId", args.orgId))
        .unique();

        if (existingFavourite)
        {
            throw new Error("Board already favourited.");
        }

        const favourite = await ctx.db.insert("userFavourites", {
            userId: userId,
            boardId: board._id,
            orgId: args.orgId
        });

        return favourite;
    }
});

export const unFavourite = mutation({
    args: {
        id: v.id("boards")
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity)
        {
            throw new Error("Unauthenticated");
        }

        const board = await ctx.db.get(args.id);

        if (!board)
        {
            throw new Error("Board not found.");
        }

        const userId = identity.subject;

        const existingFavourite = await ctx.db.query("userFavourites").withIndex("by_user_board", (q) => q.eq("userId", userId).eq("boardId", board._id))
        .unique();

        if (!existingFavourite)
        {
            throw new Error("Board is already not favourited.");
        }

        await ctx.db.delete(existingFavourite._id);

        return board;
    }
});

export const get = query({
    args:{
        id: v.id('boards')
    },
    handler: async (ctx, args) => {
        const board = await ctx.db.get(args.id);

        return board;
    }
})