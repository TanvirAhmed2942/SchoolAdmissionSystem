using System.Text.RegularExpressions;

namespace SchoolAdmissionSystem.Application.Extensions
{
    public static class StringExtensions
    {
        public static bool IsValidStudentId(this string? studentId)
        {
            return !string.IsNullOrWhiteSpace(studentId)
                && Regex.IsMatch(studentId, @"^\d{17}$");
        }
    }
}
