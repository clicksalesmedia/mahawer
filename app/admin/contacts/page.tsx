"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  status: 'NEW' | 'READ' | 'REPLIED' | 'CLOSED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminContactsPage() {
  const { data: session, status } = useSession();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Redirect if not authenticated
  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") redirect("/admin/login");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contact');
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (contactId: string, newStatus: Contact['status']) => {
    try {
      const response = await fetch(`/api/admin/contacts/${contactId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setContacts(contacts.map(contact => 
          contact.id === contactId 
            ? { ...contact, status: newStatus }
            : contact
        ));
        if (selectedContact && selectedContact.id === contactId) {
          setSelectedContact({ ...selectedContact, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Error updating contact status:', error);
    }
  };

  const filteredContacts = contacts.filter(contact => 
    statusFilter === 'all' || contact.status === statusFilter
  );

  const getStatusColor = (status: Contact['status']) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-800';
      case 'READ': return 'bg-yellow-100 text-yellow-800';
      case 'REPLIED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Contact['status']) => {
    switch (status) {
      case 'NEW': return 'جديد';
      case 'READ': return 'مقروء';
      case 'REPLIED': return 'تم الرد';
      case 'CLOSED': return 'مغلق';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-brand-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>جاري تحميل الرسائل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-bold">رسائل التواصل</h1>
              <p className="text-sm text-slate-500">إدارة رسائل العملاء والاستفسارات</p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
              >
                <option value="all">جميع الحالات</option>
                <option value="NEW">جديد</option>
                <option value="READ">مقروء</option>
                <option value="REPLIED">تم الرد</option>
                <option value="CLOSED">مغلق</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Contacts List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <h2 className="font-semibold">الرسائل ({filteredContacts.length})</h2>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {filteredContacts.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    <div className="text-4xl mb-2">📭</div>
                    <p>لا توجد رسائل</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200">
                    {filteredContacts.map((contact) => (
                      <div
                        key={contact.id}
                        onClick={() => {
                          setSelectedContact(contact);
                          if (contact.status === 'NEW') {
                            updateContactStatus(contact.id, 'READ');
                          }
                        }}
                        className={`p-4 cursor-pointer hover:bg-slate-50 transition ${
                          selectedContact?.id === contact.id ? 'bg-brand-50 border-r-2 border-brand-500' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-sm">{contact.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(contact.status)}`}>
                            {getStatusText(contact.status)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-1">{contact.subject}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(contact.createdAt).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-2">
            {selectedContact ? (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold mb-1">{selectedContact.name}</h2>
                      <p className="text-slate-600">{selectedContact.subject}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedContact.status}
                        onChange={(e) => updateContactStatus(selectedContact.id, e.target.value as Contact['status'])}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      >
                        <option value="NEW">جديد</option>
                        <option value="READ">مقروء</option>
                        <option value="REPLIED">تم الرد</option>
                        <option value="CLOSED">مغلق</option>
                      </select>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {selectedContact.email && (
                      <div>
                        <label className="text-sm font-medium text-slate-700">البريد الإلكتروني</label>
                        <p className="text-slate-900">{selectedContact.email}</p>
                      </div>
                    )}
                    {selectedContact.phone && (
                      <div>
                        <label className="text-sm font-medium text-slate-700">رقم الهاتف</label>
                        <p className="text-slate-900">{selectedContact.phone}</p>
                      </div>
                    )}
                    {selectedContact.company && (
                      <div>
                        <label className="text-sm font-medium text-slate-700">الشركة</label>
                        <p className="text-slate-900">{selectedContact.company}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-slate-700">تاريخ الإرسال</label>
                      <p className="text-slate-900">
                        {new Date(selectedContact.createdAt).toLocaleString('ar-SA')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div className="p-6">
                  <h3 className="font-semibold mb-3">محتوى الرسالة</h3>
                  <div className="bg-slate-50 rounded-lg p-4 mb-6">
                    <p className="whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-3">
                    {selectedContact.email && (
                      <a
                        href={`mailto:${selectedContact.email}?subject=رد على: ${selectedContact.subject}`}
                        className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition text-sm"
                      >
                        رد عبر البريد الإلكتروني
                      </a>
                    )}
                    {selectedContact.phone && (
                      <a
                        href={`tel:${selectedContact.phone}`}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                      >
                        اتصال هاتفي
                      </a>
                    )}
                    {selectedContact.phone && (
                      <a
                        href={`https://wa.me/${selectedContact.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`مرحباً ${selectedContact.name}، شكراً لتواصلك معنا بخصوص: ${selectedContact.subject}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm"
                      >
                        رد عبر واتساب
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-lg font-semibold mb-2">اختر رسالة لعرضها</h3>
                <p className="text-slate-600">انقر على أي رسالة من القائمة لعرض تفاصيلها</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
