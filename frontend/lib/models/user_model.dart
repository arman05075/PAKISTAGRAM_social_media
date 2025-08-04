class UserModel {
  final String uid;
  final String username;
  final String displayName;
  final String bio;
  final String avatar;
  final String level;
  final int levelPoints;
  final int postsCount;
  final int followersCount;
  final int followingCount;
  final DateTime createdAt;
  final DateTime updatedAt;

  UserModel({
    required this.uid,
    required this.username,
    required this.displayName,
    required this.bio,
    required this.avatar,
    required this.level,
    required this.levelPoints,
    required this.postsCount,
    required this.followersCount,
    required this.followingCount,
    required this.createdAt,
    required this.updatedAt,
  });

  factory UserModel.fromMap(Map<String, dynamic> map) {
    return UserModel(
      uid: map['uid'] ?? '',
      username: map['username'] ?? '',
      displayName: map['displayName'] ?? '',
      bio: map['bio'] ?? '',
      avatar: map['avatar'] ?? '',
      level: map['level'] ?? 'Newcomer',
      levelPoints: map['levelPoints'] ?? 0,
      postsCount: map['postsCount'] ?? 0,
      followersCount: map['followersCount'] ?? 0,
      followingCount: map['followingCount'] ?? 0,
      createdAt: map['createdAt']?.toDate() ?? DateTime.now(),
      updatedAt: map['updatedAt']?.toDate() ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'uid': uid,
      'username': username,
      'displayName': displayName,
      'bio': bio,
      'avatar': avatar,
      'level': level,
      'levelPoints': levelPoints,
      'postsCount': postsCount,
      'followersCount': followersCount,
      'followingCount': followingCount,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
    };
  }

  UserModel copyWith({
    String? uid,
    String? username,
    String? displayName,
    String? bio,
    String? avatar,
    String? level,
    int? levelPoints,
    int? postsCount,
    int? followersCount,
    int? followingCount,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return UserModel(
      uid: uid ?? this.uid,
      username: username ?? this.username,
      displayName: displayName ?? this.displayName,
      bio: bio ?? this.bio,
      avatar: avatar ?? this.avatar,
      level: level ?? this.level,
      levelPoints: levelPoints ?? this.levelPoints,
      postsCount: postsCount ?? this.postsCount,
      followersCount: followersCount ?? this.followersCount,
      followingCount: followingCount ?? this.followingCount,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  Color get levelColor {
    switch (level) {
      case 'Grandmaster':
        return const Color(0xFFFFD700); // Gold
      case 'Veteran':
        return const Color(0xFFC0C0C0); // Silver
      case 'Expert':
        return const Color(0xFFCD7F32); // Bronze
      case 'Intermediate':
        return const Color(0xFF4CAF50); // Green
      case 'Beginner':
        return const Color(0xFF2196F3); // Blue
      default:
        return const Color(0xFF9E9E9E); // Grey
    }
  }

  String get levelIcon {
    switch (level) {
      case 'Grandmaster':
        return '👑';
      case 'Veteran':
        return '🏆';
      case 'Expert':
        return '🥉';
      case 'Intermediate':
        return '📈';
      case 'Beginner':
        return '🌱';
      default:
        return '👤';
    }
  }
}