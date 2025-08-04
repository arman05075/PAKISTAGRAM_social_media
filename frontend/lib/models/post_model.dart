import 'user_model.dart';

class PostModel {
  final String id;
  final String userId;
  final String content;
  final String imageUrl;
  final List<String> tags;
  final bool isAIGenerated;
  final int likesCount;
  final int commentsCount;
  final DateTime createdAt;
  final DateTime updatedAt;
  final UserModel? user;
  final bool? isLiked;

  PostModel({
    required this.id,
    required this.userId,
    required this.content,
    required this.imageUrl,
    required this.tags,
    required this.isAIGenerated,
    required this.likesCount,
    required this.commentsCount,
    required this.createdAt,
    required this.updatedAt,
    this.user,
    this.isLiked,
  });

  factory PostModel.fromMap(Map<String, dynamic> map) {
    return PostModel(
      id: map['id'] ?? '',
      userId: map['userId'] ?? '',
      content: map['content'] ?? '',
      imageUrl: map['imageUrl'] ?? '',
      tags: List<String>.from(map['tags'] ?? []),
      isAIGenerated: map['isAIGenerated'] ?? false,
      likesCount: map['likesCount'] ?? 0,
      commentsCount: map['commentsCount'] ?? 0,
      createdAt: map['createdAt']?.toDate() ?? DateTime.now(),
      updatedAt: map['updatedAt']?.toDate() ?? DateTime.now(),
      user: map['user'] != null ? UserModel.fromMap(map['user']) : null,
      isLiked: map['isLiked'],
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'userId': userId,
      'content': content,
      'imageUrl': imageUrl,
      'tags': tags,
      'isAIGenerated': isAIGenerated,
      'likesCount': likesCount,
      'commentsCount': commentsCount,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
      'user': user?.toMap(),
      'isLiked': isLiked,
    };
  }

  PostModel copyWith({
    String? id,
    String? userId,
    String? content,
    String? imageUrl,
    List<String>? tags,
    bool? isAIGenerated,
    int? likesCount,
    int? commentsCount,
    DateTime? createdAt,
    DateTime? updatedAt,
    UserModel? user,
    bool? isLiked,
  }) {
    return PostModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      content: content ?? this.content,
      imageUrl: imageUrl ?? this.imageUrl,
      tags: tags ?? this.tags,
      isAIGenerated: isAIGenerated ?? this.isAIGenerated,
      likesCount: likesCount ?? this.likesCount,
      commentsCount: commentsCount ?? this.commentsCount,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      user: user ?? this.user,
      isLiked: isLiked ?? this.isLiked,
    );
  }
}

class CommentModel {
  final String id;
  final String postId;
  final String userId;
  final String content;
  final DateTime createdAt;
  final UserModel? user;

  CommentModel({
    required this.id,
    required this.postId,
    required this.userId,
    required this.content,
    required this.createdAt,
    this.user,
  });

  factory CommentModel.fromMap(Map<String, dynamic> map) {
    return CommentModel(
      id: map['id'] ?? '',
      postId: map['postId'] ?? '',
      userId: map['userId'] ?? '',
      content: map['content'] ?? '',
      createdAt: map['createdAt']?.toDate() ?? DateTime.now(),
      user: map['user'] != null ? UserModel.fromMap(map['user']) : null,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'postId': postId,
      'userId': userId,
      'content': content,
      'createdAt': createdAt,
      'user': user?.toMap(),
    };
  }
}