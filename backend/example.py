class Node:
    def __init__(self, key):
        self.left = None
        self.right = None
        self.value = key

def binary_tree_operations():
    root = None

    def insert(value):
        nonlocal root
        if root is None:
            root = Node(value)
        else:
            _insert_recursive(root, value)

    def _insert_recursive(node, value):
        if value < node.value:
            if node.left is None:
                node.left = Node(value)
            else:
                _insert_recursive(node.left, value)
        else:
            if node.right is None:
                node.right = Node(value)
            else:
                _insert_recursive(node.right, value)

    def search(value):
        return _search_recursive(root, value)

    def _search_recursive(node, value):
        if node is None:
            return False
        if node.value == value:
            return True
        elif value < node.value:
            return _search_recursive(node.left, value)
        else:
            return _search_recursive(node.right, value)

    def inorder_traversal():
        return _inorder_recursive(root)

    def _inorder_recursive(node):
        if node is None:
            return []
        return _inorder_recursive(node.left) + [node.value] + _inorder_recursive(node.right)

    # Insert nodes into the binary tree
    insert(50)
    insert(30)
    insert(40)  # Insert 40 to make search(40) return True

    print("In-order traversal:", inorder_traversal())  # Should print values in sorted order
    print("Search for 40:", search(40))  # Should print: True
    print("Search for 25:", search(25))  # Should print: False

binary_tree_operations()
