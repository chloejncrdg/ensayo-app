import React from 'react';

const LessonModal = ({ isOpen, onClose, item, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/2 font-sf-regular text-gray-800 overflow-y-auto max-h-[80vh]">
        {type === 'toolGroups' && (
          <>
            <p className='text-2xl font-sf-bold'>{item.title}</p>
            <div className='mt-3'>
              {item.unitId && <p><strong>Unit:</strong> {item.unitId.title}</p>}
              {item.moduleId && <p><strong>Module:</strong> {item.moduleId.title}</p>}
              {item.courseId && <p><strong>Course:</strong> {item.courseId.title}</p>}
            </div>
            <h3 className="text-2xl mt-8 font-sf-bold">Tools</h3>
            <table className="min-w-full bg-white border border-gray-300 mt-2">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left w-1/3">Tool Name</th>
                  <th className="py-2 px-4 border-b text-left w-2/3">Description</th>
                </tr>
              </thead>
              <tbody>
                {item.tools && item.tools.map((tool, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b text-left w-1/3">{tool.name}</td>
                    <td className="py-2 px-4 border-b text-left w-2/3">{tool.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {type === 'practicalGroups' && (
          <>
            <p><strong>Title:</strong> {item.title}</p>
            {item.unitId && <p><strong>Unit:</strong> {item.unitId.title}</p>}
            {item.moduleId && <p><strong>Module:</strong> {item.moduleId.title}</p>}
            {item.courseId && <p><strong>Course:</strong> {item.courseId.title}</p>}
            <p><strong>Simulation Link:</strong> {item.simulationPath}</p>
          </>
        )}
        {type === 'tools' && (
          <>
            <p><strong>Tool:</strong> {item.name}</p>
            {item.toolGroupId && <p><strong>Tool Group:</strong> {item.toolGroupId.title}</p>}
            {item.unitId && <p><strong>Unit:</strong> {item.unitId.title}</p>}
            {item.moduleId && <p><strong>Module:</strong> {item.moduleId.title}</p>}
            {item.courseId && <p><strong>Course:</strong> {item.courseId.title}</p>}
          </>
        )}
        <div className='flex justify-center mt-4'>
          <button onClick={onClose} className="py-2 px-4 bg-red-500 text-white rounded">Close</button>
        </div>
      </div>
    </div>
  );
}; 

export default LessonModal;
