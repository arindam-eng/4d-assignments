import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, Download, Import } from 'lucide-react';
import { api } from '../api/api';
import { FormData as FormDataType } from '../types';

const ResultsPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<FormDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const data = await api.getSubmissions();
      setSubmissions(data);
      setError(null);
    } catch (err) {
      console.error('ResultsPage: Error fetching documents', err);
      setError('Failed to retrieve documents. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const filteredData = submissions.filter((item) => {
    const fullName = `${item.firstName} ${item.lastName}`.toLowerCase().trim();
    const search = searchTerm.toLowerCase().trim();
    return !search || fullName === search;
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    handleImport(selectedFile);
  };

  const handleExport = () => {
    console.log('Exporting documents:', filteredData);
  };

  const handleImport = async (selectedFile: File) => {
    if (!selectedFile) {
      alert('Please select a file before importing.');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      console.log('====================================');
      console.log(selectedFile);
      console.log('====================================');
      formData.append('file', selectedFile);

      await api.uploadFile(formData);

      alert('File uploaded successfully!');
      setFile(null);
      fetchSubmissions();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  let content: JSX.Element;

  if (isLoading) {
    content = (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2
          aria-hidden="true"
          focusable="false"
          className="h-8 w-8 animate-spin"
        />
        <span className="sr-only">Loading...</span>
      </div>
    );
  } else if (error) {
    content = (
      <div className="max-w-2xl mx-auto">
        <Alert variant="destructive" role="alert">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  } else {
    content = (
      <Card className="max-w-7xl mx-auto" id="results-content">
        <CardHeader>
          <header>
            <h1 className="text-2xl font-bold">
              <CardTitle>Document Management System</CardTitle>
            </h1>
            <CardDescription>
              View and manage employee documentation
            </CardDescription>
          </header>

          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="flex-1">
              <Input
                placeholder="Search by full name (e.g. 'John Doe')..."
                aria-label="Search by full name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleExport}
                aria-label="Export documents"
              >
                <Download
                  aria-hidden="true"
                  focusable="false"
                  className="h-4 w-4"
                />
                Export
              </Button>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  id="file-input"
                />
                <Button
                  variant="outline"
                  className="gap-2"
                  aria-label="Import"
                  onClick={() => document.getElementById('file-input')?.click()}
                  disabled={isUploading}
                >
                  <Import aria-hidden="true" className="h-4 w-4" />
                  {isUploading ? 'Uploading...' : file ? file.name : 'Import'}
                </Button>
              </label>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <caption className="sr-only">
                Employee Document Submissions
              </caption>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Cost Center</TableHead>
                  <TableHead>Project Code</TableHead>
                  <TableHead>Supervisor Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center h-24 text-gray-500"
                    >
                      {searchTerm
                        ? 'No matching documents found'
                        : 'No documents submitted yet'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((submission) => (
                    <TableRow key={submission.employeeId}>
                      <TableCell>
                        {submission.firstName} {submission.lastName}
                      </TableCell>
                      <TableCell>{submission.employeeId}</TableCell>
                      <TableCell>
                        {new Date(submission.startDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{submission.costCenter}</TableCell>
                      <TableCell>{submission.projectCode}</TableCell>
                      <TableCell>{submission.supervisorEmail}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <main role="main" className="p-4">
      <a href="#results-content" className="sr-only focus:not-sr-only">
        Skip to Results
      </a>
      {content}
    </main>
  );
};

export default ResultsPage;
