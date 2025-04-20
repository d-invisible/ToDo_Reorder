import React, { useEffect } from "react";
import { useState } from "react";
import "./App.css";

const App = () => {
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem('myItems');
    return savedItems ? JSON.parse(savedItems) : [
      { name: "apple", disabled: true },
      { name: "banana", disabled: true },
      { name: "grape", disabled: true },
      { name: "oranage", disabled: true },
    ];
  });

  useEffect(() => {
    localStorage.setItem('myItems', JSON.stringify(items));
  }, [items]);
  
  const [newValue, setNewValue] = useState("");

  const toggleDisable = (idx) => {
    setItems((prev) =>
      prev.map((item, index) => {
        if (index === idx) {
          if (item.name === "") {
            alert("Please fill some value");
            return item;
          } else {
            return { ...item, disabled: !item.disabled };
          }
        }
        return item;
      })
    );
  };

  const updateItem = (idx, updateValue) => {
    setItems((prev) =>
      prev.map((item, index) => {
        if (index === idx) return { ...item, name: updateValue };
        return item;
      })
    );
  };

  const addItems = (newItem) => {
    if (newItem) {
      setItems((prev) => [...prev, { name: newItem, disabled: true }]);
      setNewValue("");
    }
  };

  const deleteItem = (idx) => {
    setItems((prev) => prev.filter((_, index) => index !== idx));
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
    e.target.classList.add('dragging');
    
    // Create ghost effect
    const dragImage = e.target.cloneNode(true);
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 20, 20);
    
    // Remove the ghost element after drag
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    const draggingElement = document.querySelector('.dragging');
    const currentTarget = e.currentTarget;
    
    if (draggingElement !== currentTarget) {
      // Remove drag-over class from all items first
      document.querySelectorAll('li').forEach(item => {
        item.classList.remove('drag-over');
      });
      currentTarget.classList.add('drag-over');
    }
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = e.dataTransfer.getData('text/plain');
    e.currentTarget.classList.remove('drag-over');
    
    if (dragIndex === dropIndex) return;

    setItems(prev => {
      const newItems = [...prev];
      const [draggedItem] = newItems.splice(dragIndex, 1);
      newItems.splice(dropIndex, 0, draggedItem);
      return newItems;
    });
  };

  return (
    <>
      <h1>Re-Orderable List of items</h1>
      <p>( Drag over to rearrange )</p>
      <div className="out">
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              addItems(newValue);
            }
          }}
        />
        <button onClick={() => addItems(newValue)}>Add</button>
      </div>
      <ul>
        {items.map((item, index) => (
          <li 
            key={index}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
          >
            {item.disabled ? (
              <div>{item.name}</div>
            ) : (
              <input
                type="text"
                style={{ display: "block" }}
                value={item.name}
                onChange={(e) => updateItem(index, e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === "Enter") toggleDisable(index);
                }}
              />
            )}
            <button className={item.disabled ? 'edit' : 'done'} onClick={() => toggleDisable(index)}>
              {item.disabled ? "Edit" : "Done"}
            </button>
            <button className="del" onClick={() => deleteItem(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default App;
