import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/post_provider.dart';

class CreatePostScreen extends StatefulWidget {
  const CreatePostScreen({super.key});

  @override
  State<CreatePostScreen> createState() => _CreatePostScreenState();
}

class _CreatePostScreenState extends State<CreatePostScreen> {
  final _contentController = TextEditingController();
  final _aiPromptController = TextEditingController();
  bool _isAIMode = false;
  bool _isGenerating = false;

  @override
  void dispose() {
    _contentController.dispose();
    _aiPromptController.dispose();
    super.dispose();
  }

  Future<void> _generateAIContent() async {
    if (_aiPromptController.text.trim().isEmpty) return;

    setState(() {
      _isGenerating = true;
    });

    final postProvider = Provider.of<PostProvider>(context, listen: false);
    final generatedContent = await postProvider.generateAIPost(
      prompt: _aiPromptController.text.trim(),
      type: 'code',
    );

    setState(() {
      _isGenerating = false;
    });

    if (generatedContent != null) {
      _contentController.text = generatedContent;
      _aiPromptController.clear();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Failed to generate content. Please try again.'),
        ),
      );
    }
  }

  Future<void> _createPost() async {
    if (_contentController.text.trim().isEmpty) return;

    final postProvider = Provider.of<PostProvider>(context, listen: false);
    final success = await postProvider.createPost(
      content: _contentController.text.trim(),
      isAIGenerated: _isAIMode,
    );

    if (success) {
      _contentController.clear();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Post created successfully!'),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Failed to create post. Please try again.'),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Create Post'),
        actions: [
          Consumer<PostProvider>(
            builder: (context, postProvider, child) {
              return TextButton(
                onPressed: postProvider.isLoading || _contentController.text.trim().isEmpty
                    ? null
                    : _createPost,
                child: postProvider.isLoading
                    ? const SizedBox(
                        width: 16,
                        height: 16,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Text('Post'),
              );
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // AI Mode Toggle
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    const Icon(Icons.auto_awesome, color: Colors.purple),
                    const SizedBox(width: 12),
                    const Expanded(
                      child: Text(
                        'AI-Powered Post Generation',
                        style: TextStyle(fontWeight: FontWeight.w600),
                      ),
                    ),
                    Switch(
                      value: _isAIMode,
                      onChanged: (value) {
                        setState(() {
                          _isAIMode = value;
                        });
                      },
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // AI Prompt Input (when AI mode is enabled)
            if (_isAIMode) ...[
              TextField(
                controller: _aiPromptController,
                decoration: InputDecoration(
                  labelText: 'AI Prompt',
                  hintText: 'Describe what you want to post about...',
                  prefixIcon: const Icon(Icons.lightbulb_outline),
                  suffixIcon: IconButton(
                    onPressed: _isGenerating ? null : _generateAIContent,
                    icon: _isGenerating
                        ? const SizedBox(
                            width: 16,
                            height: 16,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Icon(Icons.auto_awesome),
                  ),
                ),
                maxLines: 2,
              ),
              const SizedBox(height: 16),
            ],

            // Post Content
            Expanded(
              child: TextField(
                controller: _contentController,
                decoration: InputDecoration(
                  labelText: 'What\'s on your mind?',
                  hintText: _isAIMode
                      ? 'AI-generated content will appear here...'
                      : 'Share your thoughts, code snippets, or tech insights...',
                  alignLabelWithHint: true,
                  border: const OutlineInputBorder(),
                ),
                maxLines: null,
                expands: true,
                textAlignVertical: TextAlignVertical.top,
              ),
            ),
            const SizedBox(height: 16),

            // Post Options
            Row(
              children: [
                IconButton(
                  onPressed: () {
                    // Add image functionality
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Image upload coming soon!'),
                      ),
                    );
                  },
                  icon: const Icon(Icons.image_outlined),
                  tooltip: 'Add Image',
                ),
                IconButton(
                  onPressed: () {
                    // Add hashtag functionality
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Hashtag suggestions coming soon!'),
                      ),
                    );
                  },
                  icon: const Icon(Icons.tag),
                  tooltip: 'Add Tags',
                ),
                const Spacer(),
                Text(
                  '${_contentController.text.length}/500',
                  style: TextStyle(
                    color: _contentController.text.length > 500
                        ? Colors.red
                        : Colors.grey[600],
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}